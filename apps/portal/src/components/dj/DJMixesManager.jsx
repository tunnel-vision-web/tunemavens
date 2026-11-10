import React, { useState, useEffect, useRef } from 'react';
import {
  RiDiscFill,
  RiPlayFill,
  RiPauseFill,
  RiShieldCheckFill,
  RiSparklingFill,
  RiMailSendFill,
  RiFileTextFill,
  RiCheckFill,
  RiTimeFill,
  RiAddLine,
  RiDeleteBin6Line,
  RiEqualizerFill,
  RiShoppingBag3Fill,
  RiLockFill,
  RiLockUnlockFill,
  RiInformationFill,
  RiUploadCloud2Fill,
  RiRefreshFill,
  RiSearchLine,
  RiCloseFill,
  RiEditLine,
  RiRadioFill,
  RiMoneyDollarCircleFill,
  RiUserVoiceFill,
  RiPercentFill,
  RiUploadCloud2Line,
  RiImageAddFill,
  RiMusic2Fill,
  RiChat3Fill,
  RiSendPlaneFill,
  RiPhoneFill,
  RiHistoryFill,
  RiInboxArchiveFill
} from 'react-icons/ri';
import {
  RiCoinsFill,
  RiBankCardFill,
  RiSmartphoneFill,
  RiGlobalLine,
  RiArrowRightLine
} from 'react-icons/ri';
import { djMixesApi, storageApi } from '../../lib/api';
import { useRegion, CURRENCIES_MAP, EXCHANGE_RATES } from '../../RegionContext.jsx';
import './DJMixesManager.css';
const SAMPLE_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
// Native 8kHz PCM WAV audio generator guaranteeing resilient, offline-ready browser playback
function getFallbackAudioDataUri(durationSeconds = 60) {
  try {
    const sampleRate = 8000;
    const numSamples = sampleRate * Math.min(durationSeconds, 60);
    const buffer = new ArrayBuffer(44 + numSamples);
    const view = new DataView(buffer);
    const writeStr = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples, true);
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const beat = (t % 0.5 < 0.08) ? Math.sin(2 * Math.PI * 110 * t) * 60 : Math.sin(2 * Math.PI * 440 * t) * 10;
      view.setUint8(44 + i, Math.floor(128 + beat));
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return 'data:audio/wav;base64,' + btoa(binary);
  } catch {
    return '';
  }
}
const resolvePlayableAudioUrl = (mix) => {
  let url = mix?.audio_url || SAMPLE_AUDIO;
  if (!url || typeof url !== 'string' || url.endsWith('.mp4') || url.includes('ForBiggerBlazes')) {
    url = SAMPLE_AUDIO;
  }
  return url;
};
const GENRES = ['All', 'Amapiano', 'Afro House', 'House', 'Techno', 'Gengetone', 'Dancehall', 'Hip-Hop', 'Electronic'];
export default function DJMixesManager({ sessionUser, initialView = 'catalog', onOpenCreditReload }) {
  const {
    formatPrice,
    convertPrice,
    currency,
    currencyInfo,
    changeCurrency,
    country,
    countryFlag,
    countryName,
    t
  } = useRegion();
  const [mixes, setMixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [catalogFilter, setCatalogFilter] = useState('all'); // 'all' | 'my-mixes' | 'pending' | 'ready'
  const [currentPage, setCurrentPage] = useState(1);
  const [mixesPerPage, setMixesPerPage] = useState(6);
  const [activeView, setActiveView] = useState(initialView);

  useEffect(() => {
    setCurrentPage(1);
  }, [catalogFilter, selectedGenre, searchQuery]);
  const [selectedMix, setSelectedMix] = useState(null);
  // Sync initialView if changed externally (e.g. from topbar or DJ Pool button)
  useEffect(() => {
    if (initialView) {
      setActiveView(initialView);
      if (initialView === 'upload') setUploadStep(1);
    }
  }, [initialView]);
  // File Upload Drag & Drop State
  const [audioDragActive, setAudioDragActive] = useState(false);
  const [artworkDragActive, setArtworkDragActive] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [artworkUploading, setArtworkUploading] = useState(false);
  const [audioFileInfo, setAudioFileInfo] = useState(null);
  const [artworkFileInfo, setArtworkFileInfo] = useState(null);
  const [manualAudioUrl, setManualAudioUrl] = useState(false);
  const [manualArtUrl, setManualArtUrl] = useState(false);
  const fileInputAudioRef = useRef(null);
  const fileInputArtRef = useRef(null);
  // Communication & Rights Owner Messaging State
  const [messageModal, setMessageModal] = useState(null); // { track, recipient_name, recipient_email }
  const [messageSubject, setMessageSubject] = useState('DJ Mix Clearance Agreement & Royalties');
  const [messageBody, setMessageBody] = useState('');
  const [contactModal, setContactModal] = useState(null); // { track, ip_owner_name, ip_owner_email, rights_owner_phone, notes }
  const [isSendingComm, setIsSendingComm] = useState(false);

  // Localized Checkout & Purchase State
  const [checkoutModal, setCheckoutModal] = useState(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('wallet');
  const [checkoutPhone, setCheckoutPhone] = useState(() => sessionUser?.phone || '254712345678');
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  // Playback state
  const [playingMixId, setPlayingMixId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTrackIndex, setActiveTrackIndex] = useState(null);
  const audioRef = useRef(null);
  // Upload Wizard State
  const [uploadStep, setUploadStep] = useState(1); // 1: Info, 2: Pathway, 3: Track Extraction, 4: Splits & Dispatch
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMix, setNewMix] = useState({
    title: '',
    description: '',
    genre: 'Afro House',
    bpm_avg: 124,
    duration_seconds: 2400,
    audio_url: SAMPLE_AUDIO,
    artwork_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    commercial_price: 4.99,
    is_original_ip_only: false,
    dj_split_percentage: 40.0,
    track_owners_split_percentage: 50.0,
    platform_fee_percentage: 10.0,
    tracklist: []
  });
  const [cueImportText, setCueImportText] = useState('');
  const [extractingTracks, setExtractingTracks] = useState(false);
  // Modals
  const [contractModal, setContractModal] = useState(null); // Track info for contract preview / test sign
  const [saleLockedModal, setSaleLockedModal] = useState(null); // If user attempts to purchase un-cleared mix
  const [purchaseSuccessModal, setPurchaseSuccessModal] = useState(null);
  const [selfCertModal, setSelfCertModal] = useState(null); // Legal name for self-owned IP
  const [selfCertLegalName, setSelfCertLegalName] = useState('');
  const [actionNotice, setActionNotice] = useState(null);
  const fetchMixes = async () => {
    try {
      setLoading(true);
      const res = await djMixesApi.listMixes({ genre: selectedGenre !== 'All' ? selectedGenre : undefined, q: searchQuery });
      const data = Array.isArray(res) ? res : (res?.data || []);
      setMixes(data);
      if (selectedMix) {
        const refreshed = data.find(m => m.id === selectedMix.id);
        if (refreshed) setSelectedMix(refreshed);
      }
    } catch (err) {
      console.error('Failed to load DJ mixes', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMixes();
  }, [selectedGenre]);
  const showNotification = (msg, type = 'success') => {
    setActionNotice({ msg, type });
    setTimeout(() => setActionNotice(null), 5000);
  };
  // -------------------------------------------------------------------------
  // Local File Drag & Drop Upload Handlers
  // -------------------------------------------------------------------------
  const handleAudioUpload = async (file) => {
    if (!file) return;
    try {
      setAudioUploading(true);
      const objUrl = URL.createObjectURL(file);
      // Decode audio duration automatically
      const tempAudio = new Audio();
      tempAudio.src = objUrl;
      tempAudio.onloadedmetadata = () => {
        const dur = Math.round(tempAudio.duration) || 2400;
        setNewMix(prev => ({
          ...prev,
          duration_seconds: dur,
          audio_url: objUrl
        }));
      };
      setAudioFileInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type || 'audio/wav'
      });
      // Attempt persistent upload to backend storage
      try {
        const uploadRes = await storageApi.uploadFile(file, 'audio');
        if (uploadRes?.public_url || uploadRes?.url) {
          setNewMix(prev => ({ ...prev, audio_url: uploadRes.public_url || uploadRes.url }));
        }
      } catch (err) {
        console.warn('Backend storage upload note (using local URL):', err);
      }
      showNotification(`Audio file ready: ${file.name}`);
    } catch (err) {
      showNotification('Failed to read audio file: ' + err.message, 'error');
    } finally {
      setAudioUploading(false);
    }
  };
  const handleArtworkUpload = async (file) => {
    if (!file) return;
    try {
      setArtworkUploading(true);
      const objUrl = URL.createObjectURL(file);
      setArtworkFileInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        previewUrl: objUrl
      });
      setNewMix(prev => ({ ...prev, artwork_url: objUrl }));
      try {
        const uploadRes = await storageApi.uploadFile(file, 'artwork');
        if (uploadRes?.public_url || uploadRes?.url) {
          setNewMix(prev => ({ ...prev, artwork_url: uploadRes.public_url || uploadRes.url }));
        }
      } catch (err) {
        console.warn('Backend storage upload note (using local preview):', err);
      }
      showNotification(`Artwork image loaded: ${file.name}`);
    } catch (err) {
      showNotification('Failed to read artwork file: ' + err.message, 'error');
    } finally {
      setArtworkUploading(false);
    }
  };
  // -------------------------------------------------------------------------
  // Rights Owner Communication & Reminder Handlers
  // -------------------------------------------------------------------------
  const refreshSelectedMix = async () => {
    if (!selectedMix) return;
    try {
      const updated = await djMixesApi.getMix(selectedMix.id);
      if (updated) {
        setSelectedMix(updated);
        setMixes(prev => prev.map(m => m.id === updated.id ? updated : m));
      }
    } catch (_) {}
  };
  const handleResendReminder = async (track) => {
    if (!selectedMix) return;
    try {
      setIsSendingComm(true);
      const res = await djMixesApi.resendReminder(selectedMix.id, track.id);
      showNotification(res?.message || `Clearance reminder dispatched to ${track.ip_owner_name}`);
      await refreshSelectedMix();
    } catch (err) {
      showNotification(err?.message || 'Failed to dispatch reminder', 'error');
    } finally {
      setIsSendingComm(false);
    }
  };
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!selectedMix || !messageModal) return;
    if (!messageBody.trim()) {
      showNotification('Please enter a message note', 'error');
      return;
    }
    try {
      setIsSendingComm(true);
      await djMixesApi.sendMessage(selectedMix.id, {
        track_id: messageModal.track?.id,
        recipient_email: messageModal.recipient_email,
        recipient_name: messageModal.recipient_name,
        subject: messageSubject,
        body: messageBody
      });
      showNotification(`Message dispatched to ${messageModal.recipient_name}`);
      setMessageModal(null);
      setMessageBody('');
      await refreshSelectedMix();
    } catch (err) {
      showNotification(err?.message || 'Failed to send message', 'error');
    } finally {
      setIsSendingComm(false);
    }
  };
  const handleUpdateContact = async (e) => {
    e?.preventDefault();
    if (!selectedMix || !contactModal) return;
    try {
      setIsSendingComm(true);
      await djMixesApi.updateTrackContact(selectedMix.id, contactModal.track?.id, {
        ip_owner_name: contactModal.ip_owner_name,
        ip_owner_email: contactModal.ip_owner_email,
        rights_owner_phone: contactModal.rights_owner_phone,
        notes: contactModal.notes
      });
      showNotification('IP Owner contact information updated successfully');
      setContactModal(null);
      await refreshSelectedMix();
    } catch (err) {
      showNotification(err?.message || 'Failed to update contact info', 'error');
    } finally {
      setIsSendingComm(false);
    }
  };
  // -------------------------------------------------------------------------
  // Audio Playback & Interactive Tracklist Seek
  // -------------------------------------------------------------------------
  const safePlayAudio = (audioEl) => {
    if (!audioEl) return;
    try {
      const playPromise = audioEl.play();
      if (playPromise !== undefined && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('[Audio Playback Note]:', err?.message || err);
            setIsPlaying(false);
          });
      }
    } catch (e) {
      console.warn('[Audio Play Exception]:', e?.message || e);
      setIsPlaying(false);
    }
  };
    const handleAudioError = (e) => {
    const mediaErr = e?.target?.error;
    console.warn('[Audio media fallback engaged]:', mediaErr?.message || 'Unsupported source');
    if (audioRef.current && !audioRef.current.src.startsWith('data:')) {
      const fallbackUri = getFallbackAudioDataUri(60);
      if (fallbackUri) {
        audioRef.current.src = fallbackUri;
        try { audioRef.current.load(); } catch (err) {}
        safePlayAudio(audioRef.current);
        return;
      }
    }
    setIsPlaying(false);
  };
  const togglePlayMix = (mix) => {
    if (!mix || !audioRef.current) return;
    if (playingMixId === mix.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        safePlayAudio(audioRef.current);
      }
    } else {
      setPlayingMixId(mix.id);
      setCurrentTime(0);
      const targetSrc = resolvePlayableAudioUrl(mix);
      if (audioRef.current.src !== targetSrc) {
        audioRef.current.src = targetSrc;
        try { audioRef.current.load(); } catch (e) {}
      }
      safePlayAudio(audioRef.current);
    }
  };
  const seekToTrack = (track, mix) => {
    if (!track || !mix || !audioRef.current) return;
    const targetSrc = resolvePlayableAudioUrl(mix);
    if (playingMixId !== mix.id || audioRef.current.src !== targetSrc) {
      setPlayingMixId(mix.id);
      audioRef.current.src = targetSrc;
      try { audioRef.current.load(); } catch (e) {}
    }
    const targetTime = Number(track.start_time) || 0;
    try {
      audioRef.current.currentTime = targetTime;
    } catch (err) {
      console.warn('[Seek currentTime warn]:', err);
    }
    setCurrentTime(targetTime);
    safePlayAudio(audioRef.current);
  };
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);
    setDuration(audioRef.current.duration || 0);
    const currentMixObj = mixes.find(m => m.id === playingMixId) || selectedMix;
    if (currentMixObj?.tracklist) {
      const idx = currentMixObj.tracklist.findIndex(
        t => cur >= t.start_time && cur < t.end_time
      );
      if (idx !== -1 && idx !== activeTrackIndex) {
        setActiveTrackIndex(idx);
      }
    }
  };
  const formatSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  // -------------------------------------------------------------------------
  // Track Extraction Engine
  // -------------------------------------------------------------------------
  const handleExtractTracks = async () => {
    try {
      setExtractingTracks(true);
      const res = await djMixesApi.extractTracks({
        duration_seconds: newMix.duration_seconds,
        detected_genre: newMix.genre,
        cue_sheet_text: cueImportText
      });
      if (res?.tracklist) {
        setNewMix(prev => ({
          ...prev,
          tracklist: res.tracklist
        }));
        showNotification(`Extracted ${res.tracklist.length} tracks with boundary timestamps!`);
      }
    } catch (err) {
      showNotification('Failed to extract tracks from audio', 'error');
    } finally {
      setExtractingTracks(false);
    }
  };
  const updateTrackField = (index, field, value) => {
    setNewMix(prev => {
      const list = [...prev.tracklist];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, tracklist: list };
    });
  };
  const removeTrackItem = (index) => {
    setNewMix(prev => ({
      ...prev,
      tracklist: prev.tracklist.filter((_, i) => i !== index)
    }));
  };
  const addTrackItem = () => {
    const totalSec = newMix.duration_seconds || 3600;
    const lastTrack = newMix.tracklist[newMix.tracklist.length - 1];
    const newStart = lastTrack ? lastTrack.end_time : 0;
    const newEnd = Math.min(totalSec, newStart + 300);
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: 'New Featured Track',
      artist: 'Featured Artist',
      ip_owner_name: 'Rights Holder',
      ip_owner_email: 'creator@tunemavens.com',
      start_time: newStart,
      end_time: newEnd,
      duration_seconds: newEnd - newStart,
      split_percentage: 10.0,
      clearance_status: 'pending',
      genre: newMix.genre,
      bpm: newMix.bpm_avg
    };
    setNewMix(prev => ({
      ...prev,
      tracklist: [...prev.tracklist, newItem]
    }));
  };
  // -------------------------------------------------------------------------
  // Mix Creation & Publishing Flow
  // -------------------------------------------------------------------------
  const handleSaveMix = async () => {
    if (!newMix.title.trim()) {
      showNotification('Please enter a mix title', 'error');
      return;
    }
    if (newMix.tracklist.length === 0) {
      showNotification('Please extract or add at least one track to the playlist', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await djMixesApi.createMix({
        ...newMix,
        auto_extract_tracks: false
      });
      showNotification(`DJ Mix "${res.title}" created successfully!`);
      await fetchMixes();
      setSelectedMix(res);
      setActiveView('detail');
    } catch (err) {
      showNotification(err?.message || 'Failed to create DJ mix', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  // -------------------------------------------------------------------------
  // Clearance Dispatch & Contract Signing
  // -------------------------------------------------------------------------
  const handleDispatchClearances = async (mixId) => {
    try {
      setIsSubmitting(true);
      const res = await djMixesApi.requestClearance(mixId);
      showNotification(res.message || 'Clearance requests & contracts dispatched!');
      await fetchMixes();
      if (res.mix) setSelectedMix(res.mix);
    } catch (err) {
      showNotification(err?.message || 'Failed to dispatch clearance invitations', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSignContract = async (mixId, trackId, signerName, signerEmail) => {
    try {
      setIsSubmitting(true);
      const res = await djMixesApi.signClearance(mixId, trackId, {
        signer_name: signerName || 'IP Owner',
        signer_email: signerEmail || 'ipowner@tunemavens.com'
      });
      showNotification(`Clearance sealed! (${res.signature_hash})`);
      setContractModal(null);
      await fetchMixes();
      if (res.mix) setSelectedMix(res.mix);
    } catch (err) {
      showNotification(err?.message || 'Failed to sign clearance agreement', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePublishOriginalWarranty = async (mixId) => {
    if (!selfCertLegalName.trim()) {
      showNotification('Please enter your legal name to execute the IP warranty', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await djMixesApi.publishOriginal(mixId, {
        legal_name: selfCertLegalName,
        certification_confirmed: true
      });
      showNotification(`100% Original IP Certified! Mix is now live for sale.`);
      setSelfCertModal(null);
      await fetchMixes();
      setSelectedMix(res);
    } catch (err) {
      showNotification(err?.message || 'Failed to certify original IP', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handlePurchaseMix = (mix) => {
    // If not all cleared, show the locked governance alert modal
    if (mix.sale_locked) {
      const pendingTracks = mix.tracklist?.filter(
        t => !['signed', 'self_owned'].includes(t.clearance_status)
      ) || [];
      setSaleLockedModal({ mix, pendingTracks });
      return;
    }
    setCheckoutModal(mix);
  };

  const handleExecutePurchase = async () => {
    if (!checkoutModal) return;
    try {
      setCheckoutProcessing(true);
      const res = await djMixesApi.purchaseMix(checkoutModal.id, {
        payment_method: checkoutPaymentMethod,
        currency: currencyInfo?.code || 'USD',
        phone: checkoutPhone
      });
      setPurchaseSuccessModal({
        ...res,
        mix: checkoutModal,
        payment_method: checkoutPaymentMethod,
        currency_used: currencyInfo?.code || 'USD'
      });
      setCheckoutModal(null);
      await fetchMixes();
      if (selectedMix?.id === checkoutModal.id) {
        await refreshSelectedMix();
      }
    } catch (err) {
      showNotification(err?.message || 'Purchase failed', 'error');
    } finally {
      setCheckoutProcessing(false);
    }
  };
  return (
    <div className="dj-mixes-manager" data-testid="dj-mixes-manager">
      {/* Hidden audio element for continuous playlist playback */}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
      />
      {/* Floating Status Notification */}
      {actionNotice && (
        <div className={`dj-action-notice ${actionNotice.type}`} role="alert">
          <RiSparklingFill />
          <span>{actionNotice.msg}</span>
        </div>
      )}
      {/* Header Banner */}
      <div className="djmix-header-banner">
        <div className="djmix-header-left">
          <div className="djmix-badge">
            <RiDiscFill className="spin-slow" />
            <span>DJ Monetization & Clearance Pipeline</span>
          </div>
          <h1 className="djmix-title">Curated DJ Mixes & Sovereign IP Hub</h1>
          <p className="djmix-subtitle">
            Upload long-form sets, extract synchronized tracklist playlists, route automated 
            Split Cascade royalties, and dispatch binding digital clearance contracts to all track IP owners.
          </p>
        </div>
        <div className="djmix-header-actions">
          <div className="dj-header-currency-selector">
            <span className="currency-selector-label">Currency:</span>
            <div className="currency-pill-tabs">
              {['KES', 'USD', 'NGN', 'ZAR', 'EUR', 'GBP'].map(cCode => (
                <button
                  key={cCode}
                  type="button"
                  className={`currency-pill-tab ${currency === cCode ? 'active' : ''}`}
                  onClick={() => changeCurrency(cCode)}
                  title={`View pricing in ${cCode} (${CURRENCIES_MAP[cCode]?.name})`}
                >
                  <span className="c-sym">{CURRENCIES_MAP[cCode]?.symbol}</span>
                  <span className="c-code">{cCode}</span>
                </button>
              ))}
            </div>
          </div>
          {onOpenCreditReload && (
            <button
              type="button"
              className="btn-secondary dj-reload-credits-btn"
              onClick={() => onOpenCreditReload('Top up DJ pool & mix credits')}
              title="Top up platform credits via M-Pesa or Card"
            >
              <RiCoinsFill className="highlight-gold" />
              <span>Reload Credits</span>
            </button>
          )}
          <button
            className={`btn-primary ${activeView === 'upload' ? 'active' : ''}`}
            onClick={() => {
              if (activeView === 'upload') {
                setActiveView('catalog');
              } else {
                setActiveView('upload');
                setUploadStep(1);
              }
            }}
            data-testid="upload-mix-toggle-btn"
          >
            {activeView === 'upload' ? <RiCloseFill /> : <RiAddLine />}
            <span>{activeView === 'upload' ? 'Back to Mixes' : 'Upload New DJ Mix'}</span>
          </button>
        </div>
      </div>
      {/* Top Metric Bar */}
      <div className="djmix-stats-grid">
        <div className="djmix-stat-card">
          <div className="stat-label">Active DJ Mixes</div>
          <div className="stat-val">{mixes.length}</div>
          <div className="stat-meta">Continuous sets in catalogue</div>
        </div>
        <div className="djmix-stat-card">
          <div className="stat-label">Commercial Sales Ready</div>
          <div className="stat-val highlight-green">
            {mixes.filter(m => !m.sale_locked).length}
          </div>
          <div className="stat-meta">100% agreement or self-owned</div>
        </div>
        <div className="djmix-stat-card">
          <div className="stat-label">Clearance In Progress</div>
          <div className="stat-val highlight-amber">
            {mixes.filter(m => m.sale_locked).length}
          </div>
          <div className="stat-meta">Pending IP counterparty signoff</div>
        </div>
        <div className="djmix-stat-card">
          <div className="stat-label">Total Commercial Sales</div>
          <div className="stat-val highlight-cyan">
            {formatPrice(mixes.reduce((acc, m) => acc + (m.total_revenue || 0), 0))}
          </div>
          <div className="stat-meta">~ {Math.round(mixes.reduce((acc, m) => acc + (m.total_revenue || 0), 0) * 100).toLocaleString()} TM Credits</div>
        </div>
      </div>
      {/* ===================================================================== */}
      {/* VIEW: UPLOAD & EXTRACTION WIZARD */}
      {/* ===================================================================== */}
      {activeView === 'upload' && (
        <div className="djmix-upload-wizard card-glass">
          <div className="wizard-stepper">
            <div className={`step-item ${uploadStep >= 1 ? 'active' : ''}`}>
              <div className="step-num">1</div>
              <div className="step-label">Mix Setup</div>
            </div>
            <div className="step-line" />
            <div className={`step-item ${uploadStep >= 2 ? 'active' : ''}`}>
              <div className="step-num">2</div>
              <div className="step-label">IP Pathway</div>
            </div>
            <div className="step-line" />
            <div className={`step-item ${uploadStep >= 3 ? 'active' : ''}`}>
              <div className="step-num">3</div>
              <div className="step-label">Track Extraction</div>
            </div>
            <div className="step-line" />
            <div className={`step-item ${uploadStep >= 4 ? 'active' : ''}`}>
              <div className="step-num">4</div>
              <div className="step-label">Splits & Dispatch</div>
            </div>
          </div>
          {/* Step 1: Mix Metadata */}
          {uploadStep === 1 && (
            <div className="wizard-step-content">
              <h3 className="section-title">Step 1: Mix Profile & Audio Ingestion</h3>
              <p className="section-desc">Provide audio stream link, artwork, and technical performance details.</p>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Mix Title *</label>
                  <input
                    type="text"
                    className="input-dark"
                    placeholder="e.g. Alchemist Sunset Afro House Session Vol. 3"
                    value={newMix.title}
                    onChange={e => setNewMix({ ...newMix, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <select
                    className="input-dark"
                    value={newMix.genre}
                    onChange={e => setNewMix({ ...newMix, genre: e.target.value })}
                  >
                    {GENRES.filter(g => g !== 'All').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Average BPM</label>
                  <input
                    type="number"
                    className="input-dark"
                    value={newMix.bpm_avg}
                    onChange={e => setNewMix({ ...newMix, bpm_avg: parseInt(e.target.value, 10) || 120 })}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Minutes)</label>
                  <input
                    type="number"
                    className="input-dark"
                    value={Math.round(newMix.duration_seconds / 60)}
                    onChange={e => setNewMix({ ...newMix, duration_seconds: (parseInt(e.target.value, 10) || 60) * 60 })}
                  />
                </div>
                {/* Drag and Drop File Upload Zones */}
                <div className="form-group full-width">
                  <div className="dj-dropzone-grid">
                    {/* Audio Dropzone */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ margin: 0, fontWeight: 700 }}>Master DJ Mix Audio File *</label>
                        <button
                          type="button"
                          onClick={() => setManualAudioUrl(!manualAudioUrl)}
                          style={{ background: 'none', border: 'none', color: '#22d3ee', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {manualAudioUrl ? 'Use Drag & Drop' : 'Or paste URL'}
                        </button>
                      </div>
                      {manualAudioUrl ? (
                        <input
                          type="url"
                          className="input-dark"
                          placeholder="https://..."
                          value={newMix.audio_url}
                          onChange={e => setNewMix({ ...newMix, audio_url: e.target.value })}
                        />
                      ) : (
                        <div
                          className={`dj-dropzone ${audioDragActive ? 'active' : ''}`}
                          onDragOver={(e) => { e.preventDefault(); setAudioDragActive(true); }}
                          onDragLeave={() => setAudioDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setAudioDragActive(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleAudioUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => fileInputAudioRef.current?.click()}
                        >
                          <input
                            ref={fileInputAudioRef}
                            type="file"
                            accept="audio/*,.mp3,.wav,.flac,.m4a,.aac,.ogg"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleAudioUpload(e.target.files[0]);
                              }
                            }}
                          />
                          {audioFileInfo ? (
                            <div className="dj-file-preview-card" onClick={e => e.stopPropagation()}>
                              <RiMusic2Fill style={{ fontSize: '32px', color: '#22d3ee', flexShrink: 0 }} />
                              <div className="dj-file-details">
                                <div className="dj-file-name">{audioFileInfo.name}</div>
                                <div className="dj-file-meta">
                                  <span>{audioFileInfo.size}</span>
                                  <span>•</span>
                                  <span>{Math.round(newMix.duration_seconds / 60)} mins</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="dj-file-remove-btn"
                                onClick={() => {
                                  setAudioFileInfo(null);
                                  setNewMix({ ...newMix, audio_url: SAMPLE_AUDIO });
                                }}
                              >
                                Replace
                              </button>
                            </div>
                          ) : (
                            <>
                              <RiUploadCloud2Line className="dj-dropzone-icon" />
                              <div className="dj-dropzone-title">
                                {audioUploading ? 'Loading Audio File...' : 'Drop Mix Audio File Here'}
                              </div>
                              <div className="dj-dropzone-subtitle">or click to browse your computer</div>
                              <div className="dj-dropzone-tags">
                                <span className="dj-dropzone-tag">WAV</span>
                                <span className="dj-dropzone-tag">FLAC</span>
                                <span className="dj-dropzone-tag">MP3</span>
                                <span className="dj-dropzone-tag">AAC</span>
                                <span className="dj-dropzone-tag">M4A</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Artwork Dropzone */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ margin: 0, fontWeight: 700 }}>Cover Artwork Poster</label>
                        <button
                          type="button"
                          onClick={() => setManualArtUrl(!manualArtUrl)}
                          style={{ background: 'none', border: 'none', color: '#22d3ee', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {manualArtUrl ? 'Use Drag & Drop' : 'Or paste URL'}
                        </button>
                      </div>
                      {manualArtUrl ? (
                        <input
                          type="url"
                          className="input-dark"
                          placeholder="https://..."
                          value={newMix.artwork_url}
                          onChange={e => setNewMix({ ...newMix, artwork_url: e.target.value })}
                        />
                      ) : (
                        <div
                          className={`dj-dropzone ${artworkDragActive ? 'active' : ''}`}
                          onDragOver={(e) => { e.preventDefault(); setArtworkDragActive(true); }}
                          onDragLeave={() => setArtworkDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setArtworkDragActive(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleArtworkUpload(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => fileInputArtRef.current?.click()}
                        >
                          <input
                            ref={fileInputArtRef}
                            type="file"
                            accept="image/*,.jpg,.jpeg,.png,.webp"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleArtworkUpload(e.target.files[0]);
                              }
                            }}
                          />
                          {artworkFileInfo || newMix.artwork_url ? (
                            <div className="dj-file-preview-card" onClick={e => e.stopPropagation()}>
                              <img
                                src={artworkFileInfo?.previewUrl || newMix.artwork_url}
                                alt="Cover Preview"
                                className="dj-art-thumbnail"
                              />
                              <div className="dj-file-details">
                                <div className="dj-file-name">{artworkFileInfo?.name || 'Cover Artwork Poster'}</div>
                                <div className="dj-file-meta">
                                  <span>{artworkFileInfo?.size || 'Image Active'}</span>
                                  <span>•</span>
                                  <span>1:1 High-Res</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="dj-file-remove-btn"
                                onClick={() => {
                                  setArtworkFileInfo(null);
                                  setNewMix({ ...newMix, artwork_url: '' });
                                }}
                              >
                                Replace
                              </button>
                            </div>
                          ) : (
                            <>
                              <RiImageAddFill className="dj-dropzone-icon" />
                              <div className="dj-dropzone-title">
                                {artworkUploading ? 'Processing Image...' : 'Drop Mix Artwork Poster Here'}
                              </div>
                              <div className="dj-dropzone-subtitle">or click to browse your computer</div>
                              <div className="dj-dropzone-tags">
                                <span className="dj-dropzone-tag">JPG</span>
                                <span className="dj-dropzone-tag">PNG</span>
                                <span className="dj-dropzone-tag">WEBP</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Description & Liner Notes</label>
                  <textarea
                    className="input-dark"
                    rows="3"
                    placeholder="Venue, context, crowd energy, gear used, and track notes..."
                    value={newMix.description}
                    onChange={e => setNewMix({ ...newMix, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="wizard-actions">
                <button className="btn-secondary" onClick={() => setActiveView('catalog')}>Cancel</button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (!newMix.title.trim()) {
                      showNotification('Please provide a mix title', 'error');
                      return;
                    }
                    setUploadStep(2);
                  }}
                >
                  Continue to IP Pathway →
                </button>
              </div>
            </div>
          )}
          {/* Step 2: Publishing Pathway */}
          {uploadStep === 2 && (
            <div className="wizard-step-content">
              <h3 className="section-title">Step 2: Choose Your Rights & Publishing Pathway</h3>
              <p className="section-desc">
                Select whether this mix consists entirely of your own productions or contains third-party works requiring commercial clearance.
              </p>
              <div className="pathway-cards-grid">
                <div
                  className={`pathway-card ${newMix.is_original_ip_only ? 'selected purple' : ''}`}
                  onClick={() => setNewMix({ ...newMix, is_original_ip_only: true })}
                >
                  <div className="pathway-icon purple">
                    <RiSparklingFill />
                  </div>
                  <div className="pathway-title">Pathway A: 100% Original IP</div>
                  <div className="pathway-badge-row">
                    <span className="pill pill-purple">Instant Publish</span>
                    <span className="pill pill-green">Zero Clearance Needed</span>
                  </div>
                  <p className="pathway-desc">
                    You produced, performed, and hold 100% of all master and publishing rights for every track in this mix.
                    Requires a digital legal certification warranty. Mix is published immediately upon submission with commercial sales active.
                  </p>
                  <div className="pathway-check">
                    {newMix.is_original_ip_only && <RiCheckFill />}
                  </div>
                </div>
                <div
                  className={`pathway-card ${!newMix.is_original_ip_only ? 'selected cyan' : ''}`}
                  onClick={() => setNewMix({ ...newMix, is_original_ip_only: false })}
                >
                  <div className="pathway-icon cyan">
                    <RiShieldCheckFill />
                  </div>
                  <div className="pathway-title">Pathway B: Multi-Artist Commercial Clearance</div>
                  <div className="pathway-badge-row">
                    <span className="pill pill-cyan">Split Cascade Enabled</span>
                    <span className="pill pill-amber">100% Prior Agreement Required</span>
                  </div>
                  <p className="pathway-desc">
                    Mix includes songs or stems from other artists or record labels.
                    The system will extract all tracks, send email requests and binding digital contracts to each IP owner,
                    and enforce complete consensus before any commercial sales can occur.
                  </p>
                  <div className="pathway-check">
                    {!newMix.is_original_ip_only && <RiCheckFill />}
                  </div>
                </div>
              </div>
              <div className="wizard-actions">
                <button className="btn-secondary" onClick={() => setUploadStep(1)}>← Back</button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setUploadStep(3);
                    if (newMix.tracklist.length === 0) {
                      handleExtractTracks();
                    }
                  }}
                >
                  Continue to Track Extraction →
                </button>
              </div>
            </div>
          )}
          {/* Step 3: Track Extraction Engine & Playlist Splitting */}
          {uploadStep === 3 && (
            <div className="wizard-step-content">
              <div className="step-header-with-actions">
                <div>
                  <h3 className="section-title">Step 3: Audio Track Extraction & Playlist Splitting</h3>
                  <p className="section-desc">
                    When you upload a mix, the system extracts track segments from the long audio file and generates an 
                    interactive playlist that fans can stream continuously or jump track-by-track.
                  </p>
                </div>
                <div className="header-btn-group">
                  <button
                    className="btn-secondary"
                    onClick={handleExtractTracks}
                    disabled={extractingTracks}
                  >
                    <RiEqualizerFill />
                    <span>{extractingTracks ? 'Analyzing Waveform...' : 'Re-Run Audio Analysis'}</span>
                  </button>
                  <button className="btn-secondary" onClick={addTrackItem}>
                    <RiAddLine />
                    <span>Add Track Cue</span>
                  </button>
                </div>
              </div>
              {/* Optional Cue Sheet / Text Import Box */}
              <div className="cue-import-accordion">
                <details>
                  <summary>Optional: Import Rekordbox / Cue Sheet / Tracklist Text</summary>
                  <div className="cue-import-inner">
                    <textarea
                      className="input-dark"
                      rows="4"
                      placeholder="Paste cue markers e.g.&#10;[00:00] Artist A - Title One&#10;[04:30] Artist B - Title Two"
                      value={cueImportText}
                      onChange={e => setCueImportText(e.target.value)}
                    />
                    <button className="btn-secondary" onClick={handleExtractTracks}>
                      Parse Cue Sheet
                    </button>
                  </div>
                </details>
              </div>
              {/* Extracted Tracklist Table */}
              <div className="extracted-tracklist-table-wrap">
                <table className="extracted-tracklist-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Track Title</th>
                      <th>Artist</th>
                      <th>Cue Window (mm:ss)</th>
                      <th>Duration</th>
                      <th>IP Owner / Rights Holder</th>
                      <th>IP Owner Email</th>
                      <th style={{ width: '50px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newMix.tracklist.map((t, idx) => (
                      <tr key={t.id || idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="table-input"
                            value={t.title}
                            onChange={e => updateTrackField(idx, 'title', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="table-input"
                            value={t.artist}
                            onChange={e => updateTrackField(idx, 'artist', e.target.value)}
                          />
                        </td>
                        <td>
                          <div className="cue-inputs">
                            <input
                              type="text"
                              className="table-input mini"
                              value={formatSeconds(t.start_time)}
                              onChange={e => {
                                const parts = e.target.value.split(':');
                                if (parts.length === 2) {
                                  const sec = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
                                  updateTrackField(idx, 'start_time', sec);
                                }
                              }}
                            />
                            <span>→</span>
                            <input
                              type="text"
                              className="table-input mini"
                              value={formatSeconds(t.end_time)}
                              onChange={e => {
                                const parts = e.target.value.split(':');
                                if (parts.length === 2) {
                                  const sec = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
                                  updateTrackField(idx, 'end_time', sec);
                                }
                              }}
                            />
                          </div>
                        </td>
                        <td>{formatSeconds(t.end_time - t.start_time)}</td>
                        <td>
                          <input
                            type="text"
                            className="table-input"
                            value={t.ip_owner_name}
                            onChange={e => updateTrackField(idx, 'ip_owner_name', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            className="table-input"
                            value={t.ip_owner_email}
                            onChange={e => updateTrackField(idx, 'ip_owner_email', e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            className="btn-icon danger"
                            onClick={() => removeTrackItem(idx)}
                            title="Remove track"
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="wizard-actions">
                <button className="btn-secondary" onClick={() => setUploadStep(2)}>← Back</button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (newMix.tracklist.length === 0) {
                      showNotification('Please add at least one track to the extracted playlist', 'error');
                      return;
                    }
                    setUploadStep(4);
                  }}
                >
                  Continue to Splits & Dispatch →
                </button>
              </div>
            </div>
          )}
          {/* Step 4: Split Cascade & Dispatch */}
          {uploadStep === 4 && (
            <div className="wizard-step-content">
              <h3 className="section-title">Step 4: Revenue Split Cascade & Legal Contract Dispatch</h3>
              <p className="section-desc">
                Configure commercial retail price and automatic royalty distributions. 
                {newMix.is_original_ip_only
                  ? ' Because this is an Original IP mix, 90% goes directly to you as sovereign creator.'
                  : ' Split shares will be codified into binding digital contracts dispatched to each IP owner.'}
              </p>
              <div className="split-config-card">
                <div className="split-price-row">
                  <div>
                    <label className="stat-label">
                      Commercial Retail Download / Stream Price ({currencyInfo?.code || 'USD'})
                      <span className="label-sub"> · 1 USD = 100 TM Credits = 100 KES</span>
                    </label>
                    <input
                      type="number"
                      step="0.50"
                      min="0.50"
                      className="input-dark price-input"
                      value={currency === 'USD' ? newMix.commercial_price : convertPrice(newMix.commercial_price)}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        const rate = EXCHANGE_RATES[currency] || 1;
                        const usdVal = currency === 'USD' ? val : (val / rate);
                        setNewMix({ ...newMix, commercial_price: Math.max(0.50, Number(usdVal.toFixed(2))) });
                      }}
                    />
                    <div className="price-converted-hint">
                      <span>Live Equivalent: <strong>{formatPrice(newMix.commercial_price)}</strong></span>
                      <span> · <strong>{Math.round(newMix.commercial_price * 100).toLocaleString()} TM Credits</strong></span>
                    </div>
                  </div>
                  <div className="price-preview-callout">
                    <RiMoneyDollarCircleFill />
                    <span>Every sale is settled in real-time through the TuneLedger Split Cascade.</span>
                  </div>
                </div>
                <div className="waterfall-bars">
                  <div className="waterfall-item">
                    <div className="waterfall-label">
                      <span>DJ Curation / Performance Share</span>
                      <strong>{newMix.is_original_ip_only ? 90 : newMix.dj_split_percentage}%</strong>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill cyan"
                        style={{ width: `${newMix.is_original_ip_only ? 90 : newMix.dj_split_percentage}%` }}
                      />
                    </div>
                    <span className="waterfall-payout">
                      {formatPrice((newMix.is_original_ip_only ? 0.9 : (newMix.dj_split_percentage / 100)) * newMix.commercial_price)} per sale
                    </span>
                  </div>
                  {!newMix.is_original_ip_only && (
                    <div className="waterfall-item">
                      <div className="waterfall-label">
                        <span>Track IP Owners Pool ({newMix.tracklist.length} Rights Holders)</span>
                        <strong>{newMix.track_owners_split_percentage}%</strong>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill green"
                          style={{ width: `${newMix.track_owners_split_percentage}%` }}
                        />
                      </div>
                      <span className="waterfall-payout">
                        {formatPrice((newMix.track_owners_split_percentage / 100) * newMix.commercial_price)} total (
                        {formatPrice(((newMix.track_owners_split_percentage / 100) * newMix.commercial_price) / (newMix.tracklist.length || 1))} / track)
                      </span>
                    </div>
                  )}
                  <div className="waterfall-item">
                    <div className="waterfall-label">
                      <span>TuneMavens Platform Administration & Statutory Escrow</span>
                      <strong>10.0%</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill purple" style={{ width: '10%' }} />
                    </div>
                    <span className="waterfall-payout">
                      {formatPrice(0.10 * newMix.commercial_price)} per sale
                    </span>
                  </div>
                </div>
              </div>
              {/* Legal Notice */}
              <div className="legal-notice-box">
                <RiInformationFill className="notice-icon" />
                <div>
                  <strong>Platform Rule & Condition Precedent:</strong>
                  <p>
                    {newMix.is_original_ip_only
                      ? 'You are publishing under Sovereign Original IP terms. You will electronically sign a warranty confirming sole copyright.'
                      : 'Prior to having any sales, ALL IP owners whose music is included in this tracklist must execute their clearance agreement on TuneMavens. Commercial checkout will be locked until 100% agreement is completed.'}
                  </p>
                </div>
              </div>
              <div className="wizard-actions">
                <button className="btn-secondary" onClick={() => setUploadStep(3)}>← Back</button>
                <button
                  className="btn-primary"
                  onClick={handleSaveMix}
                  disabled={isSubmitting}
                >
                  <RiUploadCloud2Fill />
                  <span>{isSubmitting ? 'Registering Mix...' : 'Save & Publish DJ Mix'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* ===================================================================== */}
      {/* VIEW: CATALOGUE OF MIXES */}
      {/* ===================================================================== */}
      {activeView === 'catalog' && (() => {
        const myMixesCount = mixes.filter(m => m.user_id === String(sessionUser?._id || sessionUser?.id) || m.dj_name === (sessionUser?.brand_name || sessionUser?.name || 'DJ')).length;
        const pendingMixesCount = mixes.filter(m => m.sale_locked && !m.is_original_ip_only).length;
        const readyMixesCount = mixes.filter(m => !m.sale_locked || m.is_original_ip_only).length;
        const displayedMixes = mixes.filter(mix => {
          if (catalogFilter === 'my-mixes') {
            const isMine = mix.user_id === String(sessionUser?._id || sessionUser?.id) || mix.dj_name === (sessionUser?.brand_name || sessionUser?.name || 'DJ');
            if (!isMine) return false;
          } else if (catalogFilter === 'pending') {
            if (!mix.sale_locked || mix.is_original_ip_only) return false;
          } else if (catalogFilter === 'ready') {
            if (mix.sale_locked && !mix.is_original_ip_only) return false;
          }
          return true;
        });
        return (
        <div className="djmix-catalog-view">
          {/* Sub-Tab Filter Switcher */}
          <div className="catalog-tab-switcher" data-testid="catalog-tab-switcher">
            <button
              type="button"
              className={`catalog-tab-btn ${catalogFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCatalogFilter('all')}
              data-testid="filter-all-mixes-btn"
            >
              <RiDiscFill size={15} />
              <span>All Mixes ({mixes.length})</span>
            </button>
            <button
              type="button"
              className={`catalog-tab-btn ${catalogFilter === 'my-mixes' ? 'active' : ''}`}
              onClick={() => setCatalogFilter('my-mixes')}
              data-testid="filter-my-mixes-btn"
            >
              <RiUserVoiceFill size={15} />
              <span>My Uploaded Mixes ({myMixesCount})</span>
            </button>
            <button
              type="button"
              className={`catalog-tab-btn ${catalogFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setCatalogFilter('pending')}
              data-testid="filter-pending-mixes-btn"
            >
              <RiLockFill size={15} />
              <span>Clearance In-Progress ({pendingMixesCount})</span>
            </button>
            <button
              type="button"
              className={`catalog-tab-btn ${catalogFilter === 'ready' ? 'active' : ''}`}
              onClick={() => setCatalogFilter('ready')}
              data-testid="filter-ready-mixes-btn"
            >
              <RiShieldCheckFill size={15} />
              <span>Commercial Ready ({readyMixesCount})</span>
            </button>
          </div>
          {/* Filter Bar */}
          <div className="catalog-filters card-glass">
            <div className="search-box">
              <RiSearchLine className="search-icon" />
              <input
                type="text"
                placeholder="Search mix title, DJ, artist, or genre..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchMixes()}
              />
            </div>
            <div className="genre-pill-list">
              {GENRES.map(g => (
                <button
                  key={g}
                  className={`genre-pill ${selectedGenre === g ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          {/* Mix Grid */}
          {loading ? (
            <div className="loading-state card-glass">
              <RiRefreshFill className="spin-slow" />
              <span>Loading DJ mixes and clearance ledgers...</span>
            </div>
          ) : mixes.length === 0 ? (
            <div className="empty-state card-glass">
              <RiRadioFill className="empty-icon" />
              <h3>No DJ Mixes Found</h3>
              <p>Be the first to publish a curated continuous set with automated track extraction!</p>
              <button className="btn-primary" onClick={() => setActiveView('upload')}>
                <RiAddLine />
                <span>Upload First DJ Mix</span>
              </button>
            </div>
          ) : (() => {
            const totalItems = displayedMixes.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / mixesPerPage));
            const safePage = Math.min(Math.max(1, currentPage), totalPages);
            const startIdx = (safePage - 1) * mixesPerPage;
            const paginatedMixes = displayedMixes.slice(startIdx, startIdx + mixesPerPage);
            return (
            <>
            <div className="mixes-grid">
              {paginatedMixes.map(mix => {
                const isCurrentlyPlaying = playingMixId === mix.id && isPlaying;
                const totalTracks = mix.tracklist?.length || 0;
                const clearedTracks = mix.clearance_summary?.cleared_tracks ?? (
                  mix.is_original_ip_only ? totalTracks : mix.tracklist?.filter(t => ['signed', 'self_owned'].includes(t.clearance_status)).length || 0
                );
                const isAllCleared = !mix.sale_locked;
                return (
                  <div key={mix.id} className="mix-card card-glass">
                    {/* Artwork & Play Overlay */}
                    <div className="mix-card-artwork-wrap">
                      <img
                        src={mix.artwork_url || SAMPLE_AUDIO}
                        alt={mix.title}
                        className="mix-card-art"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                      <button
                        className="mix-play-btn"
                        onClick={() => togglePlayMix(mix)}
                        aria-label="Play mix"
                      >
                        {isCurrentlyPlaying ? <RiPauseFill /> : <RiPlayFill />}
                      </button>
                      <div className="mix-duration-badge">
                        <RiTimeFill />
                        <span>{formatSeconds(mix.duration_seconds)}</span>
                      </div>
                    </div>
                    {/* Card Content */}
                    <div className="mix-card-body">
                      <div className="mix-card-top-row">
                        <span className="mix-genre-tag">{mix.genre} · {mix.bpm_avg} BPM</span>
                        {mix.is_original_ip_only ? (
                          <span className="pill pill-purple">
                            <RiSparklingFill /> 100% Original IP
                          </span>
                        ) : isAllCleared ? (
                          <span className="pill pill-green">
                            <RiShieldCheckFill /> 100% Cleared · Selling
                          </span>
                        ) : (
                          <span className="pill pill-amber">
                            <RiLockFill /> Clearance In Progress ({clearedTracks}/{totalTracks})
                          </span>
                        )}
                      </div>
                      <h3 className="mix-card-title">{mix.title}</h3>
                      <div className="mix-card-dj">
                        <RiUserVoiceFill />
                        <span>{mix.dj_name}</span>
                      </div>
                      <p className="mix-card-desc">{mix.description}</p>
                      {/* Mini Track Extraction Snapshot */}
                      <div className="mix-card-playlist-preview">
                        <div className="preview-header">
                          <span>Extracted Playlist ({totalTracks} Tracks)</span>
                          <span className="split-badge">
                            {mix.is_original_ip_only ? '90% Sovereign' : '40% DJ / 50% IP'}
                          </span>
                        </div>
                        <div className="preview-tracks">
                          {mix.tracklist?.slice(0, 3).map((t, idx) => (
                            <div
                              key={t.id || idx}
                              className={`mini-track-row ${playingMixId === mix.id && activeTrackIndex === idx ? 'playing' : ''}`}
                              onClick={() => seekToTrack(t, mix)}
                            >
                              <span className="track-cue">[{formatSeconds(t.start_time)}]</span>
                              <span className="track-title-trim">{t.artist} - {t.title}</span>
                              <span className={`status-dot ${['signed', 'self_owned'].includes(t.clearance_status) ? 'green' : 'amber'}`} />
                            </div>
                          ))}
                          {totalTracks > 3 && (
                            <div className="more-tracks-hint">
                              +{totalTracks - 3} more tracks in playlist...
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Card Footer Actions */}
                      <div className="mix-card-footer">
                        <div className="mix-price-tag">
                          {formatPrice(mix.commercial_price || 4.99)}
                          <span className="credits-badge">{Math.round((mix.commercial_price || 4.99) * 100)} Credits</span>
                        </div>
                        <div className="footer-btns">
                          <button
                            className="btn-secondary mini"
                            onClick={() => {
                              setSelectedMix(mix);
                              setActiveView('detail');
                            }}
                          >
                            Tracklist & Clearance
                          </button>
                          <button
                            className={`btn-primary mini ${mix.sale_locked ? 'locked' : ''}`}
                            onClick={() => handlePurchaseMix(mix)}
                            title={mix.sale_locked ? 'Locked: 100% IP agreement required prior to sale' : `Purchase Lossless Mix · ${formatPrice(mix.commercial_price || 4.99)}`}
                          >
                            {mix.sale_locked ? <RiLockFill /> : <RiShoppingBag3Fill />}
                            <span>{mix.sale_locked ? 'Locked' : `Buy · ${formatPrice(mix.commercial_price || 4.99)}`}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Bottom Pagination Bar */}
            <div className="djmix-pagination-bar card-glass" data-testid="dj-mixes-pagination">
              <div className="djmix-pagination-info">
                Showing <strong>{totalItems === 0 ? 0 : startIdx + 1}</strong>–<strong>{Math.min(startIdx + mixesPerPage, totalItems)}</strong> of <strong>{totalItems}</strong> DJ {totalItems === 1 ? 'Mix' : 'Mixes'}
                <span className="djmix-pagination-sep">·</span>
                <span>Page {safePage} of {totalPages}</span>
              </div>
              <div className="djmix-pagination-controls">
                <label className="djmix-page-size-label">
                  <span>Per page:</span>
                  <select
                    value={mixesPerPage}
                    onChange={(e) => {
                      setMixesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="djmix-page-size-select"
                    data-testid="dj-mixes-page-size"
                  >
                    <option value={3}>3 / page</option>
                    <option value={6}>6 / page</option>
                    <option value={9}>9 / page</option>
                    <option value={12}>12 / page</option>
                  </select>
                </label>
                <div className="djmix-page-buttons">
                  <button
                    type="button"
                    className="djmix-page-btn"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    data-testid="dj-mixes-prev-page"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`djmix-page-btn num ${safePage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                      data-testid={`dj-mixes-page-${pageNum}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="djmix-page-btn"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    data-testid="dj-mixes-next-page"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
            </>
            );
          })()}
        </div>
      );
      })()}
      {/* ===================================================================== */}
      {/* VIEW: MIX DETAIL / TRACKLIST PLAYLIST & CLEARANCE CONSOLE */}
      {/* ===================================================================== */}
      {activeView === 'detail' && selectedMix && (
        <div className="djmix-detail-view card-glass">
          <div className="detail-top-bar">
            <button className="btn-secondary" onClick={() => setActiveView('catalog')}>
              ← Back to Mixes
            </button>
            <div className="detail-actions">
              {!selectedMix.is_original_ip_only && (
                <button
                  className="btn-secondary"
                  onClick={() => handleDispatchClearances(selectedMix.id)}
                  disabled={isSubmitting}
                >
                  <RiMailSendFill />
                  <span>Dispatch All Clearance Contracts</span>
                </button>
              )}
              {selectedMix.is_original_ip_only && !selectedMix.self_certification_signature && (
                <button
                  className="btn-primary"
                  onClick={() => setSelfCertModal(selectedMix)}
                >
                  <RiShieldCheckFill />
                  <span>Sign IP Ownership Warranty</span>
                </button>
              )}
              <button
                className={`btn-primary ${selectedMix.sale_locked ? 'locked' : ''}`}
                onClick={() => handlePurchaseMix(selectedMix)}
              >
                {selectedMix.sale_locked ? <RiLockFill /> : <RiShoppingBag3Fill />}
                <span>
                  {selectedMix.sale_locked ? 'Sales Locked (Clearance Incomplete)' : `Buy Mix (${formatPrice(selectedMix.commercial_price)})`}
                </span>
              </button>
            </div>
          </div>
          {/* Hero Mix Player Panel */}
          <div className="detail-hero-player">
            <img
              src={selectedMix.artwork_url || SAMPLE_AUDIO}
              alt={selectedMix.title}
              className="detail-hero-art"
            />
            <div className="detail-hero-meta">
              <div className="detail-badge-row">
                <span className="mix-genre-tag">{selectedMix.genre} · {selectedMix.bpm_avg} BPM</span>
                {selectedMix.is_original_ip_only ? (
                  <span className="pill pill-purple">
                    <RiSparklingFill /> 100% Original IP · Sovereign Release
                  </span>
                ) : !selectedMix.sale_locked ? (
                  <span className="pill pill-green">
                    <RiShieldCheckFill /> 100% Cleared · Active For Commercial Sales
                  </span>
                ) : (
                  <span className="pill pill-amber">
                    <RiLockFill /> Clearance In Progress ({selectedMix.clearance_summary?.cleared_tracks}/{selectedMix.clearance_summary?.total_tracks} Signed)
                  </span>
                )}
              </div>
              <h2 className="detail-hero-title">{selectedMix.title}</h2>
              <div className="detail-hero-curator">Curated by <strong>{selectedMix.dj_name}</strong></div>
              <p className="detail-hero-desc">{selectedMix.description}</p>
              {/* Player Progress Scrubber */}
              <div className="player-transport-controls">
                <button
                  className="transport-play-btn"
                  onClick={() => togglePlayMix(selectedMix)}
                >
                  {playingMixId === selectedMix.id && isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                </button>
                <div className="transport-time-track">
                  <div className="time-display">
                    <span>{playingMixId === selectedMix.id ? formatSeconds(currentTime) : '00:00'}</span>
                    <span className="time-total">/ {formatSeconds(selectedMix.duration_seconds)}</span>
                  </div>
                  <div
                    className="transport-bar"
                    onClick={(e) => {
                      if (!audioRef.current || playingMixId !== selectedMix.id) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pos = (e.clientX - rect.left) / rect.width;
                      audioRef.current.currentTime = pos * selectedMix.duration_seconds;
                    }}
                  >
                    <div
                      className="transport-progress"
                      style={{
                        width: playingMixId === selectedMix.id
                          ? `${(currentTime / (selectedMix.duration_seconds || 1)) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Prior Agreement Enforcement Callout */}
          <div className={`prior-agreement-banner ${selectedMix.sale_locked ? 'amber-glow' : 'green-glow'}`}>
            <div className="banner-icon-col">
              {selectedMix.sale_locked ? <RiLockFill /> : <RiLockUnlockFill />}
            </div>
            <div className="banner-text-col">
              <h4>
                {selectedMix.sale_locked
                  ? 'Commercial Sales Locked: Prior Complete Agreement In Progress'
                  : '100% Prior Agreement Verified — Commercial Sales Active!'}
              </h4>
              <p>
                {selectedMix.is_original_ip_only
                  ? 'This mix is classified as 100% Original IP. No external clearances are required.'
                  : selectedMix.sale_locked
                  ? 'TuneMavens platform policy mandates: Prior to having any sales, all IP owners must be in complete agreement and sign the requisite contract on our system.'
                  : 'All featured IP owners have executed their requisite contracts with cryptographic SHA-256 seals. Split Cascade distributions are ready.'}
              </p>
            </div>
            <div className="banner-meter">
              <div className="meter-circle">
                <span className="meter-pct">
                  {selectedMix.is_original_ip_only ? 100 : selectedMix.clearance_summary?.clearance_percentage || 0}%
                </span>
                <span className="meter-lbl">Agreed</span>
              </div>
            </div>
          </div>
          {/* Localized Sovereign Financial Ledger Overview */}
          <div className="detail-financial-strip">
            <div className="financial-metric-card cyan">
              <span className="fin-lbl">Commercial Price</span>
              <div className="fin-val highlight-cyan">{formatPrice(selectedMix.commercial_price)}</div>
              <span className="fin-sub">{Math.round((selectedMix.commercial_price || 0) * 100)} Unified TM Credits</span>
            </div>
            <div className="financial-metric-card green">
              <span className="fin-lbl">Total Gross Revenue</span>
              <div className="fin-val highlight-green">{formatPrice(selectedMix.total_revenue || 0)}</div>
              <span className="fin-sub">{selectedMix.sales_count || 0} Paid Downloads & Streams</span>
            </div>
            <div className="financial-metric-card purple">
              <span className="fin-lbl">DJ Curation Share ({selectedMix.is_original_ip_only ? 90 : selectedMix.dj_split_percentage}%)</span>
              <div className="fin-val highlight-purple">
                {formatPrice((selectedMix.total_revenue || 0) * ((selectedMix.is_original_ip_only ? 90 : selectedMix.dj_split_percentage) / 100))}
              </div>
              <span className="fin-sub">Sovereign Direct Payout</span>
            </div>
            <div className="financial-metric-card amber">
              <span className="fin-lbl">Track Rights Pool ({selectedMix.track_owners_split_percentage}%)</span>
              <div className="fin-val highlight-amber">
                {formatPrice((selectedMix.total_revenue || 0) * (selectedMix.track_owners_split_percentage / 100))}
              </div>
              <span className="fin-sub">Split across {selectedMix.tracklist?.length || 0} rights holders</span>
            </div>
          </div>

          {/* Interactive Synchronized Tracklist Playlist */}
          <div className="detail-tracklist-section">
            <div className="section-head-split">
              <div>
                <h3 className="section-title">Synchronized Tracklist Playlist ({selectedMix.tracklist?.length} Tracks)</h3>
                <p className="section-desc">Click any track to jump the audio player directly to that cue point.</p>
              </div>
              <div className="split-waterfall-badge">
                Split Cascade: {selectedMix.dj_split_percentage}% DJ · {selectedMix.track_owners_split_percentage}% Track Owners · {selectedMix.platform_fee_percentage}% Platform
              </div>
            </div>
            <div className="tracklist-cards-list">
              {selectedMix.tracklist?.map((track, idx) => {
                const isTrackActive = playingMixId === selectedMix.id && activeTrackIndex === idx;
                const isSigned = ['signed', 'self_owned'].includes(track.clearance_status);
                return (
                  <div
                    key={track.id || idx}
                    className={`track-item-card ${isTrackActive ? 'active-playing' : ''}`}
                  >
                    <div className="track-left-col" onClick={() => seekToTrack(track, selectedMix)}>
                      <button className="track-seek-btn" title="Jump to track cue">
                        {isTrackActive && isPlaying ? <RiEqualizerFill className="equalizer-bounce" /> : <RiPlayFill />}
                      </button>
                      <div className="track-num-box">{idx + 1}</div>
                      <div className="track-info-col">
                        <div className="track-title-text">{track.title}</div>
                        <div className="track-meta-line">
                          <span>by <strong>{track.artist}</strong></span>
                          <span>·</span>
                          <span className="track-cue-stamp">
                            [{formatSeconds(track.start_time)} - {formatSeconds(track.end_time)}] ({formatSeconds(track.duration_seconds || (track.end_time - track.start_time))})
                          </span>
                          <span>·</span>
                          <span className="track-key-bpm">{track.key || '4A'} · {track.bpm || selectedMix.bpm_avg} BPM</span>
                        </div>
                      </div>
                    </div>
                    <div className="track-right-col">
                      <div className="track-ip-owner-info">
                        <div className="ip-name">{track.ip_owner_name}</div>
                        <div className="ip-email">{track.ip_owner_email}</div>
                      </div>
                      <div className="track-earnings-col">
                        <div className="track-split-share">
                          <span className="share-pct">{track.split_percentage || (100 / (selectedMix.tracklist.length || 1)).toFixed(1)}%</span>
                          <span className="share-lbl">Pool Split</span>
                        </div>
                        <div className="track-earnings-share">
                          <span className="earnings-amount">
                            {formatPrice(((selectedMix.track_owners_split_percentage || 50) / 100) * (selectedMix.commercial_price || 0) * ((track.split_percentage || (100 / (selectedMix.tracklist.length || 1))) / 100))}
                          </span>
                          <span className="earnings-lbl">per sale</span>
                        </div>
                      </div>
                      <div className="track-clearance-pill">
                        {track.clearance_status === 'self_owned' ? (
                          <span className="pill pill-purple">
                            <RiSparklingFill /> Self-Owned
                          </span>
                        ) : track.clearance_status === 'signed' ? (
                          <span className="pill pill-green">
                            <RiCheckFill /> Signed & Sealed
                          </span>
                        ) : track.clearance_status === 'requested' ? (
                          <span className="pill pill-amber">
                            <RiTimeFill /> Invite Sent
                          </span>
                        ) : (
                          <span className="pill pill-dark">
                            Pending Invite
                          </span>
                        )}
                      </div>
                      <div className="track-contract-action">
                        {isSigned ? (
                          <div className="seal-display" title={track.signature_hash}>
                            <RiShieldCheckFill className="seal-icon" />
                            <span>{track.signature_hash?.substring(0, 14)}...</span>
                          </div>
                        ) : (
                          <button
                            className="btn-secondary mini"
                            onClick={() => setContractModal({ track, mix: selectedMix })}
                          >
                            <RiFileTextFill />
                            <span>Review & Sign</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* ----------------------------------------------------------------- */}
          {/* RIGHTS OWNER COMMUNICATION & ACTIVITY LOG CONSOLE */}
          {/* ----------------------------------------------------------------- */}
          <div className="comm-console-section" data-testid="comm-console-section">
            <div className="comm-console-head">
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiChat3Fill style={{ color: '#22d3ee' }} />
                  Rights Owner Communication & Clearance Console
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                  Track clearance contract dispatches, reminder notifications, in-app messaging, and counterparty representative contacts.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary mini"
                  onClick={() => handleDispatchClearances(selectedMix.id)}
                  disabled={isSubmitting || selectedMix.is_original_ip_only}
                  title="Resend invitation contracts to all pending rights holders"
                >
                  <RiMailSendFill />
                  <span>Dispatch All Pending</span>
                </button>
              </div>
            </div>
            {/* Counterparty Cards Grid */}
            <div className="comm-counterparty-grid">
              {selectedMix.tracklist?.map((track, idx) => {
                const isSigned = ['signed', 'self_owned'].includes(track.clearance_status);
                return (
                  <div key={track.id || idx} className="comm-counterparty-card">
                    <div>
                      <div className="comm-card-top">
                        <span className="comm-track-badge">#{idx + 1} {track.title}</span>
                        {track.clearance_status === 'self_owned' ? (
                          <span className="pill pill-purple" style={{ fontSize: '10px' }}>Self-Owned</span>
                        ) : track.clearance_status === 'signed' ? (
                          <span className="pill pill-green" style={{ fontSize: '10px' }}>Signed &amp; Sealed</span>
                        ) : track.clearance_status === 'requested' ? (
                          <span className="pill pill-amber" style={{ fontSize: '10px' }}>
                            Invited {track.reminder_count > 0 ? `(${track.reminder_count} reminders)` : ''}
                          </span>
                        ) : (
                          <span className="pill pill-dark" style={{ fontSize: '10px' }}>Pending Dispatch</span>
                        )}
                      </div>
                      <div className="comm-owner-name">{track.ip_owner_name || 'Rights Owner'}</div>
                      <div className="comm-owner-contact">
                        <span>✉️ {track.ip_owner_email || 'No email specified'}</span>
                        {track.rights_owner_phone && <span>📞 {track.rights_owner_phone}</span>}
                        {track.notes && <span style={{ fontStyle: 'italic', color: '#64748b' }}>📝 {track.notes}</span>}
                      </div>
                    </div>
                    <div className="comm-card-actions">
                      {!isSigned && (
                        <button
                          type="button"
                          className="comm-btn-mini primary"
                          onClick={() => handleResendReminder(track)}
                          disabled={isSendingComm}
                          title="Send reminder notice & contract link"
                        >
                          <RiMailSendFill size={13} />
                          <span>Remind</span>
                        </button>
                      )}
                      <button
                        type="button"
                        className="comm-btn-mini"
                        onClick={() => setMessageModal({
                          track,
                          recipient_name: track.ip_owner_name,
                          recipient_email: track.ip_owner_email,
                          mix: selectedMix
                        })}
                        title="Send in-app note or inquiry"
                      >
                        <RiChat3Fill size={13} />
                        <span>Message</span>
                      </button>
                      <button
                        type="button"
                        className="comm-btn-mini"
                        onClick={() => setContactModal({
                          track,
                          ip_owner_name: track.ip_owner_name || '',
                          ip_owner_email: track.ip_owner_email || '',
                          rights_owner_phone: track.rights_owner_phone || '',
                          notes: track.notes || ''
                        })}
                        title="Update contact email or representative"
                      >
                        <RiEditLine size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Chronological Communication Audit Timeline */}
            <div className="comm-timeline-wrap">
              <div className="comm-timeline-title">
                <RiHistoryFill style={{ color: '#22d3ee' }} />
                <span>Audit &amp; Communication History ({selectedMix.communication_log?.length || 0} events)</span>
              </div>
              {(!selectedMix.communication_log || selectedMix.communication_log.length === 0) ? (
                <div style={{ color: '#64748b', fontSize: '12px', padding: '12px 0' }}>
                  No communications logged yet. Dispatch clearance requests to start tracking counterparty activity.
                </div>
              ) : (
                <div className="comm-timeline-list">
                  {selectedMix.communication_log.map((entry, i) => (
                    <div
                      key={entry.id || i}
                      className={`comm-timeline-item ${entry.type === 'contract_signed' ? 'signed' : entry.type === 'reminder_sent' ? 'reminder' : 'note'}`}
                    >
                      <div style={{ flex: 1 }}>
                        <div className="comm-timeline-meta">
                          <span style={{ fontWeight: 700, color: '#cbd5e1' }}>
                            {entry.sender_name || (entry.sender === 'dj' ? selectedMix.dj_name : 'Rights Owner')}
                            {entry.recipient_name ? ` → ${entry.recipient_name}` : ''}
                          </span>
                          <span>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Just now'}</span>
                        </div>
                        <div className="comm-timeline-subject">{entry.subject}</div>
                        <div className="comm-timeline-body">{entry.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ===================================================================== */}
      {/* MODAL: DIRECT RIGHTS OWNER MESSAGE */}
      {/* ===================================================================== */}
      {messageModal && (
        <div className="modal-backdrop">
          <div className="modal-card card-glass" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RiChat3Fill className="modal-icon" />
                <h3>Message Rights Owner</h3>
              </div>
              <button className="btn-icon" onClick={() => setMessageModal(null)}>
                <RiCloseFill />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="modal-body">
              <div style={{ background: 'rgba(34, 211, 238, 0.08)', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '12px' }}>
                <div>Recipient: <strong>{messageModal.recipient_name}</strong> &lt;{messageModal.recipient_email}&gt;</div>
                <div style={{ marginTop: '2px', color: '#94a3b8' }}>Regarding track: <strong>{messageModal.track?.title}</strong> in <em>{selectedMix?.title}</em></div>
              </div>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>Subject</label>
                <input
                  type="text"
                  className="input-dark"
                  value={messageSubject}
                  onChange={e => setMessageSubject(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Message Note</label>
                <textarea
                  className="input-dark"
                  rows="4"
                  placeholder="Explain set context, proposed split, or follow up on pending contract..."
                  value={messageBody}
                  onChange={e => setMessageBody(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setMessageModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSendingComm}>
                  <RiSendPlaneFill />
                  <span>{isSendingComm ? 'Sending...' : 'Send Message Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===================================================================== */}
      {/* MODAL: EDIT COUNTERPARTY CONTACT INFO */}
      {/* ===================================================================== */}
      {contactModal && (
        <div className="modal-backdrop">
          <div className="modal-card card-glass" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RiEditLine className="modal-icon" />
                <h3>Edit Rights Counterparty Contact</h3>
              </div>
              <button className="btn-icon" onClick={() => setContactModal(null)}>
                <RiCloseFill />
              </button>
            </div>
            <form onSubmit={handleUpdateContact} className="modal-body">
              <div style={{ marginBottom: '12px', fontSize: '12px', color: '#94a3b8' }}>
                Update contact records for <strong>{contactModal.track?.title}</strong>. Correcting an email will update future reminder destinations.
              </div>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Legal Representative / Owner Name</label>
                <input
                  type="text"
                  className="input-dark"
                  value={contactModal.ip_owner_name}
                  onChange={e => setContactModal({ ...contactModal, ip_owner_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Contact Email (for clearance contract invitations)</label>
                <input
                  type="email"
                  className="input-dark"
                  value={contactModal.ip_owner_email}
                  onChange={e => setContactModal({ ...contactModal, ip_owner_email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label>Phone / WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  className="input-dark"
                  placeholder="+254 700 000000"
                  value={contactModal.rights_owner_phone}
                  onChange={e => setContactModal({ ...contactModal, rights_owner_phone: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Notes / Publisher / Label Affiliation</label>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="e.g. Managed by Sub-Saharan Music Rights / Direct Publisher"
                  value={contactModal.notes}
                  onChange={e => setContactModal({ ...contactModal, notes: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setContactModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSendingComm}>
                  <RiCheckFill />
                  <span>{isSendingComm ? 'Saving...' : 'Save Contact'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===================================================================== */}
      {/* MODAL: CONTRACT REVIEW & TEST SIGN */}
      {/* ===================================================================== */}
      {contractModal && (
        <div className="modal-backdrop">
          <div className="modal-card card-glass">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RiFileTextFill className="modal-icon" />
                <h3>DJ Mix Clearance & Revenue Split Agreement</h3>
              </div>
              <button className="btn-icon" onClick={() => setContractModal(null)}>
                <RiCloseFill />
              </button>
            </div>
            <div className="modal-body">
              <div className="contract-preview-box">
                <div className="contract-header">
                  <h4>DJ Mix Commercial Distribution & Revenue Split License</h4>
                  <div className="contract-id">Reference: {contractModal.track.contract_id || `TM-CLR-${contractModal.mix.id}`}</div>
                </div>
                <div className="contract-clause">
                  <strong>Clause 1: Scope & Non-Exclusive Commercial Grant</strong>
                  <p>
                    The Rights Holder (<strong>{contractModal.track.ip_owner_name}</strong>) grants Curating DJ (<strong>{contractModal.mix.dj_name}</strong>) 
                    and TuneMavens a worldwide non-exclusive digital distribution license to include the master recording and underlying 
                    composition of <strong>"{contractModal.track.title}"</strong> ({contractModal.track.artist}) as part of 
                    the continuous DJ mix entitled <strong>"{contractModal.mix.title}"</strong>.
                  </p>
                </div>
                <div className="contract-clause">
                  <strong>Clause 2: Prior Agreement Requirement (Condition Precedent)</strong>
                  <p>
                    TuneMavens platform governance mandates that prior to having any sales or monetized downloads, all IP owners 
                    featured in the tracklist must be in complete agreement. Commercial sales remain locked until all parties execute this agreement.
                  </p>
                </div>
                <div className="contract-clause">
                  <strong>Clause 3: Revenue Split Waterfall</strong>
                  <p>
                    Gross revenue collected from retail sales ({formatPrice(contractModal.mix.commercial_price)} / ${contractModal.mix.commercial_price?.toFixed(2)} USD) is allocated via the TuneLedger:
                    DJ Curation Share ({contractModal.mix.dj_split_percentage}%), Track IP Owners Pool ({contractModal.mix.track_owners_split_percentage}% 
                    distributed according to cue points), and TuneMavens Escrow/Admin (10%).
                  </p>
                </div>
              </div>
              <div className="signature-input-group">
                <label>Signatory Legal Name (IP Owner / Authorized Representative)</label>
                <input
                  type="text"
                  className="input-dark"
                  id="modal-signer-name"
                  defaultValue={contractModal.track.ip_owner_name || 'Rights Holder'}
                />
                <label style={{ marginTop: '8px' }}>Signatory Email</label>
                <input
                  type="email"
                  className="input-dark"
                  id="modal-signer-email"
                  defaultValue={contractModal.track.ip_owner_email || 'creator@tunemavens.com'}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setContractModal(null)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => {
                  const nameEl = document.getElementById('modal-signer-name');
                  const emailEl = document.getElementById('modal-signer-email');
                  handleSignContract(
                    contractModal.mix.id,
                    contractModal.track.id,
                    nameEl ? nameEl.value : 'IP Owner',
                    emailEl ? emailEl.value : 'creator@tunemavens.com'
                  );
                }}
                disabled={isSubmitting}
              >
                <RiShieldCheckFill />
                <span>Execute & Cryptographically Seal (SIG-SHA256)</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===================================================================== */}
      {/* MODAL: SALE LOCKED GOVERNANCE ENFORCEMENT */}
      {/* ===================================================================== */}
      {saleLockedModal && (
        <div className="modal-backdrop">
          <div className="modal-card card-glass locked-alert">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RiLockFill className="modal-icon highlight-amber" />
                <h3>Commercial Sales Locked: 100% Prior Agreement Required</h3>
              </div>
              <button className="btn-icon" onClick={() => setSaleLockedModal(null)}>
                <RiCloseFill />
              </button>
            </div>
            <div className="modal-body">
              <p className="locked-alert-text">
                According to platform governance: <strong>Prior to having any sales, all IP owners must be in complete agreement.</strong> 
                Commercial checkout is held in statutory escrow until every featured recording has an executed clearance agreement.
              </p>
              <div className="pending-tracks-box">
                <h4>Pending Rights Holders ({saleLockedModal.pendingTracks.length}):</h4>
                <ul>
                  {saleLockedModal.pendingTracks.map((t, i) => (
                    <li key={i}>
                      <strong>{t.title}</strong> by {t.artist} — Rights Holder: <em>{t.ip_owner_name}</em> ({t.ip_owner_email})
                    </li>
                  ))}
                </ul>
              </div>
              <p className="hint-text">
                You can send reminder emails or direct the IP owners to execute their digital clearance agreements in the portal.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSaleLockedModal(null)}>Close</button>
              <button
                className="btn-primary"
                onClick={() => {
                  setSaleLockedModal(null);
                  handleDispatchClearances(saleLockedModal.mix.id);
                }}
              >
                <RiMailSendFill />
                <span>Send Clearance Reminders to All IP Owners</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===================================================================== */}
      {/* MODAL: LOCALIZED COMMERCIAL PURCHASE & CHECKOUT */}
      {/* ===================================================================== */}
      {checkoutModal && (
        <div className="modal-backdrop">
          <div className="modal-card card-glass dj-checkout-modal">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RiShoppingBag3Fill className="modal-icon highlight-cyan" />
                <h3>Commercial License & Mix Access Checkout</h3>
              </div>
              <button className="btn-icon" onClick={() => setCheckoutModal(null)}>
                <RiCloseFill />
              </button>
            </div>
            <div className="modal-body">
              {/* Mix Product Summary Card */}
              <div className="checkout-product-card">
                <img
                  src={checkoutModal.artwork_url || SAMPLE_AUDIO}
                  alt={checkoutModal.title}
                  className="checkout-thumb"
                />
                <div className="checkout-product-info">
                  <div className="checkout-badge-line">
                    <span className="pill pill-green"><RiShieldCheckFill /> 100% Cleared & Verified</span>
                    <span className="checkout-genre">{checkoutModal.genre} · {checkoutModal.bpm_avg} BPM</span>
                  </div>
                  <h4 className="checkout-product-title">{checkoutModal.title}</h4>
                  <div className="checkout-product-curator">Curated by <strong>{checkoutModal.dj_name}</strong></div>
                  <div className="checkout-meta-line">
                    <span>{checkoutModal.tracklist?.length || 0} Synchronized Tracks</span>
                    <span>·</span>
                    <span>{formatSeconds(checkoutModal.duration_seconds)} Lossless Audio</span>
                  </div>
                </div>
              </div>

              {/* Localized Price Display & Currency Switcher Strip */}
              <div className="checkout-pricing-strip">
                <div className="checkout-price-main">
                  <span className="price-label">Total Commercial Price:</span>
                  <div className="price-amount-large">
                    {formatPrice(checkoutModal.commercial_price || 4.99)}
                  </div>
                  <div className="price-sub-equiv">
                    <span>{Math.round((checkoutModal.commercial_price || 4.99) * 100).toLocaleString()} Unified TM Credits</span>
                    {currency !== 'USD' && <span> (${(checkoutModal.commercial_price || 4.99).toFixed(2)} USD base)</span>}
                  </div>
                </div>
                <div className="checkout-currency-switcher">
                  <span className="switcher-lbl">Change Currency:</span>
                  <div className="switcher-pills">
                    {['KES', 'USD', 'NGN', 'ZAR', 'EUR', 'GBP'].map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`pill-c-btn ${currency === c ? 'active' : ''}`}
                        onClick={() => changeCurrency(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="checkout-payment-section">
                <label className="section-subtitle">Select Payment Settlement Method</label>
                <div className="payment-options-grid">
                  <div
                    className={`payment-option-card ${checkoutPaymentMethod === 'wallet' ? 'selected' : ''}`}
                    onClick={() => setCheckoutPaymentMethod('wallet')}
                  >
                    <div className="option-radio">
                      <div className="radio-inner" />
                    </div>
                    <RiCoinsFill className="option-icon gold" />
                    <div className="option-text">
                      <div className="option-title">Unified TM Credits Wallet</div>
                      <div className="option-sub">
                        Balance: {sessionUser?.credits ?? 1250} Credits ({formatPrice((sessionUser?.credits ?? 1250) / 100)})
                      </div>
                    </div>
                  </div>

                  <div
                    className={`payment-option-card ${checkoutPaymentMethod === 'mpesa' ? 'selected' : ''}`}
                    onClick={() => setCheckoutPaymentMethod('mpesa')}
                  >
                    <div className="option-radio">
                      <div className="radio-inner" />
                    </div>
                    <RiSmartphoneFill className="option-icon green" />
                    <div className="option-text">
                      <div className="option-title">M-Pesa STK Push ({countryFlag} {CURRENCIES_MAP.KES.symbol})</div>
                      <div className="option-sub">Instant prompt on handset · Direct African mobile money</div>
                    </div>
                  </div>

                  <div
                    className={`payment-option-card ${checkoutPaymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setCheckoutPaymentMethod('card')}
                  >
                    <div className="option-radio">
                      <div className="radio-inner" />
                    </div>
                    <RiBankCardFill className="option-icon cyan" />
                    <div className="option-text">
                      <div className="option-title">Debit / Credit Card</div>
                      <div className="option-sub">Visa, Mastercard, Apple Pay, Google Pay ({currencyInfo?.code})</div>
                    </div>
                  </div>
                </div>

                {checkoutPaymentMethod === 'mpesa' && (
                  <div className="mpesa-phone-field">
                    <label>M-Pesa Registered Mobile Number</label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix">+254</span>
                      <input
                        type="tel"
                        className="input-dark"
                        placeholder="712345678"
                        value={checkoutPhone.replace(/^\+?254/, '')}
                        onChange={e => setCheckoutPhone('254' + e.target.value.replace(/\D/g, '').replace(/^0+/, ''))}
                      />
                    </div>
                    <span className="phone-hint">You will receive an STK Push PIN prompt on your phone for {formatPrice(checkoutModal.commercial_price || 4.99)}.</span>
                  </div>
                )}
              </div>

              {/* Instant Split Cascade Breakdown Preview */}
              <div className="checkout-split-preview">
                <label className="section-subtitle">Real-Time Split Cascade Distribution</label>
                <div className="checkout-splits-table">
                  <div className="c-split-row">
                    <span>Curating DJ ({checkoutModal.is_original_ip_only ? 90 : checkoutModal.dj_split_percentage}%):</span>
                    <strong>{formatPrice((checkoutModal.commercial_price || 4.99) * ((checkoutModal.is_original_ip_only ? 90 : checkoutModal.dj_split_percentage) / 100))}</strong>
                  </div>
                  {!checkoutModal.is_original_ip_only && (
                    <div className="c-split-row">
                      <span>Featured Track Owners Pool ({checkoutModal.track_owners_split_percentage}%):</span>
                      <strong>{formatPrice((checkoutModal.commercial_price || 4.99) * (checkoutModal.track_owners_split_percentage / 100))}</strong>
                    </div>
                  )}
                  <div className="c-split-row">
                    <span>TuneMavens Protocol & Statutory Escrow (10%):</span>
                    <strong>{formatPrice((checkoutModal.commercial_price || 4.99) * 0.10)}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setCheckoutModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleExecutePurchase}
                disabled={checkoutProcessing}
              >
                <RiCheckFill />
                <span>
                  {checkoutProcessing
                    ? 'Processing Authorization...'
                    : `Authorize & Pay ${formatPrice(checkoutModal.commercial_price || 4.99)}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: PURCHASE SUCCESS & SPLIT CASCADE SUMMARY */}
      {/* ===================================================================== */}
      {purchaseSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-card card-glass">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RiShoppingBag3Fill className="modal-icon highlight-green" />
                <h3>Purchase Verified & Royalty Splits Distributed</h3>
              </div>
              <button className="btn-icon" onClick={() => setPurchaseSuccessModal(null)}>
                <RiCloseFill />
              </button>
            </div>
            <div className="modal-body">
              <div className="purchase-receipt-box">
                <div className="receipt-ref">Order: {purchaseSuccessModal.order_reference}</div>
                <div className="receipt-amt">
                  {formatPrice(purchaseSuccessModal.price_paid || 4.99)}
                  <span className="receipt-credits"> · {Math.round((purchaseSuccessModal.price_paid || 4.99) * 100)} TM Credits</span>
                </div>
                <div className="receipt-msg">{purchaseSuccessModal.message}</div>
              </div>
              <h4>Split Cascade Payouts Dispatched (Real-Time Ledger):</h4>
              <div className="splits-summary-table">
                <div className="split-row">
                  <span>Curating DJ Sovereign Payout:</span>
                  <strong>{formatPrice(purchaseSuccessModal.splits_distributed?.dj_payout || 0)}</strong>
                </div>
                <div className="split-row">
                  <span>Track IP Owners Pool:</span>
                  <strong>{formatPrice(purchaseSuccessModal.splits_distributed?.track_owners_pool || 0)}</strong>
                </div>
                <div className="split-row">
                  <span>TuneMavens Protocol Fee:</span>
                  <strong>{formatPrice(purchaseSuccessModal.splits_distributed?.platform_fee || 0)}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setPurchaseSuccessModal(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===================================================================== */}
      {/* MODAL: 100% ORIGINAL IP WARRANTY CERTIFICATION */}
      {/* ===================================================================== */}
      {selfCertModal && (
        <div className="modal-backdrop">
          <div className="modal-card card-glass">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <RiSparklingFill className="modal-icon highlight-purple" />
                <h3>100% Original IP Ownership Certification Warranty</h3>
              </div>
              <button className="btn-icon" onClick={() => setSelfCertModal(null)}>
                <RiCloseFill />
              </button>
            </div>
            <div className="modal-body">
              <p>
                I hereby warrant and legally certify that I created 100% of the musical compositions, recordings, 
                and arrangement featured in <strong>"{selfCertModal.title}"</strong>, and that no third-party copyrighted 
                material or uncleared samples are contained within this continuous DJ mix.
              </p>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Enter Full Legal Name as Electronic Signature</label>
                <input
                  type="text"
                  className="input-dark"
                  placeholder="e.g. Marcus Vance Ochieng"
                  value={selfCertLegalName}
                  onChange={e => setSelfCertLegalName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelfCertModal(null)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={() => handlePublishOriginalWarranty(selfCertModal.id)}
                disabled={isSubmitting}
              >
                <RiShieldCheckFill />
                <span>Execute Sovereign Warranty & Unlock Sales</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
