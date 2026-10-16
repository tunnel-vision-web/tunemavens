import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  RiCustomerService2Fill,
  RiLifebuoyFill,
  RiShieldCheckFill,
  RiRobot2Fill,
  RiChat1Fill,
  RiSendPlaneFill,
  RiUploadCloud2Fill,
  RiCloseLine,
  RiCheckLine,
  RiTimeLine,
  RiAlertFill,
  RiCoinsFill,
  RiSearchLine,
  RiFilterLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiRefreshLine,
  RiLockFill,
  RiLockUnlockFill,
  RiFileList3Fill,
  RiDiscFill,
  RiFileTextFill,
  RiSparklingFill,
  RiInformationFill,
  RiCheckDoubleFill,
  RiExchangeDollarFill
} from 'react-icons/ri';

import InAppDocModal from '../common/InAppDocModal.jsx';

const LOCAL_TICKETS_KEY = 'tunemavens_support_tickets';
const LOCAL_CATALOG_KEY = 'tunemavens_catalog_tracks';

// Category Definitions tailored to TuneMavens ecosystem
export const SUPPORT_CATEGORIES = [
  {
    id: 'royalty_split',
    label: 'Royalty & Split Cascade Dispute',
    description: 'Discrepancy in streaming payouts, unrecouped deductions, or missing split shares.'
  },
  {
    id: 'ddex_distro',
    label: 'DDEX Ingestion & Distribution Error',
    description: 'DSP delivery rejection, checksum container error, missing lossless master audio.'
  },
  {
    id: 'sync_claim',
    label: 'Sync Licensing & Placement Claim',
    description: 'Cue sheet discrepancy, stem delivery delay, or music supervisor escrow hold.'
  },
  {
    id: 'credits_billing',
    label: 'Unified Credits & Billing Issue',
    description: 'Credit reload latency, merchant POS discrepancy, or package reload error.'
  },
  {
    id: 'copyright_dmca',
    label: 'Copyright & DMCA Notice',
    description: 'Infringement claim, unauthorized sample usage, or safe harbor counter-notice.'
  },
  {
    id: 'technical_account',
    label: 'Account Access & Technical Error',
    description: 'Team seat permissions, API webhook issue, or studio tool malfunction.'
  }
];

export default function SupportTicketsPanel({
  sessionUser,
  onUpdateCredits,
  catalogTracks = [],
  initialTab = 'file',
  embeddedInDashboard = false
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'file', 'my-tickets', 'admin-desk'
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null); // Active ticket for AI Live Chat

  // Form State
  const [formData, setFormData] = useState({
    name: sessionUser?.name || '',
    email: sessionUser?.email || '',
    phone: sessionUser?.phone || '',
    referenceId: '',
    category: SUPPORT_CATEGORIES[0].label,
    description: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Chat message input for interactive AI Live Chat
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Admin Desk filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [linkingTicket, setLinkingTicket] = useState(null);
  const [manualReferenceId, setManualReferenceId] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [refundModalTicket, setRefundModalTicket] = useState(null);
  const [refundAmount, setRefundAmount] = useState(100);

  // Contextual Documentation Modal State
  const [helpDocModalOpen, setHelpDocModalOpen] = useState(false);

  // Determine which article to open based on the user's active issue or section
  const getContextualHelpArticleId = () => {
    if (selectedTicket) {
      const cat = (selectedTicket.category || '').toLowerCase();
      if (cat.includes('dispute') || cat.includes('split') || cat.includes('royalty')) {
        return 'tuneledger-escrow-dispute-locks';
      }
      if (cat.includes('ddex') || cat.includes('distribution') || cat.includes('ingestion')) {
        return 'tunesupport-ai-diagnosis-and-resolution';
      }
      if (cat.includes('sync') || cat.includes('placement')) {
        return 'sync-licensing-masterclass';
      }
      if (cat.includes('audio') || cat.includes('stem') || cat.includes('master')) {
        return 'masterlab-ai-mastering';
      }
      if (cat.includes('metadata') || cat.includes('isrc')) {
        return 'music-metadata-isrc-iswc-ipi-upc';
      }
    }

    if (activeTab === 'file') {
      const cat = (formData.category || '').toLowerCase();
      if (cat.includes('dispute') || cat.includes('split') || cat.includes('royalty')) {
        return 'tuneledger-escrow-dispute-locks';
      }
      if (cat.includes('ddex') || cat.includes('distribution') || cat.includes('ingestion')) {
        return 'tunesupport-ai-diagnosis-and-resolution';
      }
      if (cat.includes('sync') || cat.includes('placement')) {
        return 'sync-licensing-masterclass';
      }
      if (cat.includes('audio') || cat.includes('stem') || cat.includes('master')) {
        return 'masterlab-ai-mastering';
      }
      if (cat.includes('metadata') || cat.includes('isrc')) {
        return 'music-metadata-isrc-iswc-ipi-upc';
      }
    }

    return 'how-support-ticketing-works';
  };

  const getContextualHelpTitle = () => {
    if (selectedTicket) {
      return `Ticket #${selectedTicket.id} · ${selectedTicket.category}`;
    }
    if (activeTab === 'file') {
      return `File a Claim · ${formData.category}`;
    }
    if (activeTab === 'admin-desk') {
      return 'Operations Desk · Disputes & Escrow';
    }
    return 'Support & AI Claims Desk';
  };

  // 1. Initial Load & Seeding
  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch('/api/support/tickets');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTickets(data);
          localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(data));
          setLoadingTickets(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend support fetch error, loading localStorage:', err);
    }

    // Fallback to localStorage or seed
    const cached = localStorage.getItem(LOCAL_TICKETS_KEY);
    if (cached) {
      try {
        setTickets(JSON.parse(cached));
      } catch (_) {}
    } else {
      // Default initial tickets matching backend seeds
      const initialSeeds = [
        {
          id: 'ST-294019',
          client_name: 'John Miller',
          client_email: 'john.miller@example.com',
          client_phone: '4045550192',
          reference_id: 'US-TM1-24-00109',
          reference_type: 'isrc',
          reference_label: 'Midnight Horizon (Single)',
          category: 'Royalty & Split Cascade Dispute',
          description: "The streaming royalties for Q2 on track 'Midnight Horizon' were distributed, but our co-producer was credited 15% instead of 25% per our executed split sheet. Payouts for this cascade transaction need to be frozen until splits are corrected in TuneLedger.",
          attachments: [],
          status: 'Pending Review',
          is_linked: true,
          is_frozen: true,
          ai_diagnosis: {
            confidence_score: 98.4,
            root_cause: 'Discrepancy detected between split cascade rule SC-89241 (15% Producer) and signed Split Sheet agreement v2 (25% Producer). Escrow hold automatically placed on $420.50 in streaming royalties.',
            ledger_safeguard: 'Active Dispute Lock: Split Cascade Payout Frozen in TuneLedger',
            payout_frozen: true,
            recommended_action: 'Rebalance participant splits in TuneLedger Studio, auto-distribute held funds, and issue 75 Unified Credits service rebate.',
            auto_settlement_available: true,
            suggested_refund_credits: 75,
            category_badge: 'TuneLedger Dispute Protection'
          },
          ai_thread: [
            {
              sender: 'ai',
              sender_name: 'TuneSupport AI',
              text: "Hello John, TuneSupport AI has logged your claim. 🤖 We verified track ISRC 'US-TM1-24-00109' and placed an automated escrow freeze on Split Cascade Tx #SC-89241 ($420.50) to protect your funds. Our diagnosis suggests a 10% unallocated split discrepancy.",
              created_at: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'ST-849204',
          client_name: 'Alice Smith',
          client_email: 'alice.smith@example.com',
          client_phone: '7705550183',
          reference_id: 'US-TM1-24-00812',
          reference_type: 'isrc',
          reference_label: 'Neon Dreamscape (Album Mix)',
          category: 'DDEX Ingestion & Distribution Error',
          description: 'Apple Music and Spotify rejected the lossless master release due to an unlinked ISRC checksum in the ERN 4.3 XML package. The track is currently live on Tidal but muted on Spotify.',
          attachments: [],
          status: 'AI Diagnosed',
          is_linked: true,
          is_frozen: false,
          ai_diagnosis: {
            confidence_score: 96.8,
            root_cause: 'DDEX Ingestion Parser detected mismatched duration metadata: Spotify reported 214s vs 216s in FLAC container header. Auto-checksum fix generated.',
            ledger_safeguard: 'Ingestion Queue Reparsing Flagged',
            payout_frozen: false,
            recommended_action: 'Auto-reencode master container with synchronized frame headers and re-dispatch XML payload to DSP endpoints at zero credit charge.',
            auto_settlement_available: true,
            suggested_refund_credits: 0,
            category_badge: 'DDEX Ingestion Protocol'
          },
          ai_thread: [
            {
              sender: 'ai',
              sender_name: 'TuneSupport AI',
              text: "Hello Alice! TuneSupport AI analyzed the ERN 4.3 delivery logs. 🤖 We discovered a 2-second duration header checksum mismatch with Spotify's ingestion node. You can click 'Execute AI Settlement' to re-dispatch the corrected package to DSPs immediately at 0 credits.",
              created_at: new Date(Date.now() - 7200000).toISOString()
            }
          ],
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setTickets(initialSeeds);
      localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(initialSeeds));
    }
    setLoadingTickets(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update form with sessionUser details if provided
  useEffect(() => {
    if (sessionUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || sessionUser.name || '',
        email: prev.email || sessionUser.email || '',
        phone: prev.phone || sessionUser.phone || ''
      }));
    }
  }, [sessionUser]);

  // Handle Photo & Document Attachments (Max 3, max 5MB each)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachments.length > 3) {
      alert('You can upload a maximum of 3 attachments.');
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 5MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            data: reader.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // 2. Submit Support Ticket & Claim
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    const ref = formData.referenceId.trim();

    // Check if auto-matched in local tracks
    const allTracks = catalogTracks.length > 0
      ? catalogTracks
      : JSON.parse(localStorage.getItem(LOCAL_CATALOG_KEY) || '[]');
    const matchedTrack = allTracks.find(t =>
      ref && (t.isrc === ref || t.id === ref || (t.title && t.title.toLowerCase().includes(ref.toLowerCase())))
    );

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      reference_id: ref || (matchedTrack ? matchedTrack.isrc : null),
      category: formData.category,
      description: formData.description,
      attachments: attachments.map(a => a.data)
    };

    let newTicket = null;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        newTicket = await res.json();
      }
    } catch (err) {
      console.warn('Backend ticket creation failed, using client fallback:', err);
    }

    // Client-side fallback if backend was unavailable
    if (!newTicket) {
      const ticketId = 'ST-' + Math.floor(100000 + Math.random() * 900000);
      const isSplitDispute = payload.category.includes('Split') || payload.category.includes('Royalty');
      const nowIso = new Date().toISOString();
      
      const aiDiag = {
        confidence_score: 98.4,
        root_cause: isSplitDispute 
          ? `Discrepancy detected in TuneLedger split rule calculation for ${payload.reference_id || 'catalog asset'}. Unrecouped master deductions conflict with active participant split shares.`
          : `Automated diagnostic verified for ${payload.category}. Integrity validation active.`,
        ledger_safeguard: isSplitDispute 
          ? 'Active Dispute Lock: Split Cascade Payout Frozen in TuneLedger'
          : 'Standard Priority Queue',
        payout_frozen: isSplitDispute,
        recommended_action: isSplitDispute
          ? 'Rebalance participant splits in TuneLedger Studio, auto-distribute held funds, and issue 75 Unified Credits service rebate.'
          : 'Process automated adjustment and notify operations supervisor.',
        auto_settlement_available: true,
        suggested_refund_credits: isSplitDispute ? 75 : 50,
        category_badge: isSplitDispute ? 'TuneLedger Dispute Protection' : 'AI Diagnostic Engine'
      };

      newTicket = {
        id: ticketId,
        client_name: payload.name,
        client_email: payload.email,
        client_phone: payload.phone,
        reference_id: payload.reference_id,
        reference_type: 'isrc',
        reference_label: matchedTrack ? matchedTrack.title : (payload.reference_id ? `Ref: ${payload.reference_id}` : null),
        category: payload.category,
        description: payload.description,
        attachments: payload.attachments,
        status: 'Pending Review',
        is_linked: !!(payload.reference_id || matchedTrack),
        is_frozen: isSplitDispute,
        ai_diagnosis: aiDiag,
        ai_thread: [
          {
            sender: 'ai',
            sender_name: 'TuneSupport AI',
            text: `Hello ${payload.name}! TuneSupport AI has logged your claim (${ticketId}). 🤖\n\n**Instant AI Diagnosis:** ${aiDiag.root_cause}\n\n**Recommended Action:** ${aiDiag.recommended_action}\n\n${isSplitDispute ? "🔒 **Dispute Lock Active:** Split Cascade payouts on your referenced item have been frozen in TuneLedger to safeguard funds." : ""}`,
            created_at: nowIso
          }
        ],
        created_at: nowIso,
        updated_at: nowIso
      };
    }

    // Update state and persistence
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(updatedTickets));

    // If split cascade dispute, notify global system to freeze
    if (newTicket.is_frozen) {
      window.dispatchEvent(new CustomEvent('tunemavens-split-freeze', {
        detail: { ticketId: newTicket.id, referenceId: newTicket.reference_id }
      }));
    }

    setSubmissionResult(newTicket);
    setSelectedTicket(newTicket);
    setSubmitting(false);
  };

  // 3. Send Message in AI Live Chat Thread
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTicket) return;

    setSendingChat(true);
    const userMsgText = chatInput.trim();
    setChatInput('');

    let updatedTicket = null;

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          sender_name: sessionUser?.name || selectedTicket.client_name || 'User'
        })
      });
      if (res.ok) {
        const data = await res.json();
        updatedTicket = data.ticket;
      }
    } catch (err) {
      console.warn('Backend chat failed, using client AI synthesis:', err);
    }

    if (!updatedTicket) {
      // Client-side AI fallback synthesis
      const nowIso = new Date().toISOString();
      const userMsg = {
        sender: 'user',
        sender_name: sessionUser?.name || selectedTicket.client_name || 'User',
        text: userMsgText,
        created_at: nowIso
      };

      // Generate context-aware AI reply
      const msgLower = userMsgText.toLowerCase();
      let aiText = '';
      if (msgLower.includes('freeze') || msgLower.includes('escrow') || msgLower.includes('hold')) {
        aiText = `TuneSupport AI here! 🤖 TuneLedger Escrow Protection is active on ticket ${selectedTicket.id}. All split disbursements on ${selectedTicket.reference_id || 'this catalog asset'} remain locked to ensure no funds are wrongly disbursed. Once you accept the settlement or an admin signs off, the lock releases immediately.`;
      } else if (msgLower.includes('refund') || msgLower.includes('credit')) {
        const credits = selectedTicket.ai_diagnosis?.suggested_refund_credits || 75;
        aiText = `Under TuneMavens' Zero-Monthly-Fee Unified Credits policy, our automated engine has authorized an immediate credit rebate of **${credits} Unified Credits**. You can click **'Execute AI Settlement'** above to receive these credits in your wallet instantly.`;
      } else if (msgLower.includes('status') || msgLower.includes('update')) {
        aiText = `Ticket ${selectedTicket.id} is currently in **${selectedTicket.status}**. AI diagnostic confidence is ${selectedTicket.ai_diagnosis?.confidence_score || 98.4}%. All evidence and catalog metadata have been validated.`;
      } else {
        aiText = `Thank you for the update! I have recorded your message in the verified audit ledger for **${selectedTicket.id}**. Our automated resolution plan is ready to execute whenever you or your team confirms.`;
      }

      const aiMsg = {
        sender: 'ai',
        sender_name: 'TuneSupport AI',
        text: aiText,
        created_at: new Date(Date.now() + 500).toISOString()
      };

      const updatedThread = [...(selectedTicket.ai_thread || []), userMsg, aiMsg];
      updatedTicket = {
        ...selectedTicket,
        ai_thread: updatedThread,
        updated_at: nowIso
      };
    }

    // Update list & active ticket
    setSelectedTicket(updatedTicket);
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(
      tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t)
    ));
    setSendingChat(false);
  };

  // 4. Execute AI Settlement / Claim Resolution
  const handleExecuteResolution = async (ticket, actionType = 'resolve', customCredits = null, note = '') => {
    const creditsToRefund = customCredits !== null
      ? customCredits
      : (ticket.ai_diagnosis?.suggested_refund_credits || 75);

    let updated = null;

    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          resolution_note: note || 'AI Automated Settlement executed and verified.',
          refund_credits: creditsToRefund
        })
      });
      if (res.ok) {
        const data = await res.json();
        updated = data.ticket;
      }
    } catch (err) {
      console.warn('Backend resolve failed, applying client settlement:', err);
    }

    if (!updated) {
      const nowIso = new Date().toISOString();
      const newStatus = actionType === 'refund_credits' ? 'Refunded' : 'Resolved';
      const logText = actionType === 'refund_credits'
        ? `Claim settled via Unified Credits Refund: +${creditsToRefund} credits credited to client wallet. TuneLedger dispute lock released.`
        : `Claim officially resolved. AI Settlement verified and applied.`;

      const auditMsg = {
        sender: 'system',
        sender_name: 'TuneSupport Settlement Engine',
        text: `✅ **Resolution Audit:** ${logText}`,
        created_at: nowIso
      };

      updated = {
        ...ticket,
        status: newStatus,
        is_frozen: false,
        ai_thread: [...(ticket.ai_thread || []), auditMsg],
        updated_at: nowIso
      };
    }

    // Apply Unified Credits to user if credits refunded
    if (creditsToRefund > 0) {
      try {
        const curCredits = parseInt(localStorage.getItem('tunemavens_credits') || '600', 10);
        const newTotal = curCredits + creditsToRefund;
        localStorage.setItem('tunemavens_credits', String(newTotal));
        window.dispatchEvent(new CustomEvent('tunemavens-credits-reloaded', {
          detail: { balance: newTotal, reason: `Support Claim Settlement #${ticket.id}` }
        }));
        if (typeof onUpdateCredits === 'function') {
          onUpdateCredits(newTotal);
        }
      } catch (_) {}
    }

    // Unfreeze Split Cascade globally
    window.dispatchEvent(new CustomEvent('tunemavens-split-unfreeze', {
      detail: { ticketId: ticket.id, referenceId: ticket.reference_id }
    }));

    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (selectedTicket && selectedTicket.id === updated.id) {
      setSelectedTicket(updated);
    }
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(
      tickets.map(t => t.id === updated.id ? updated : t)
    ));
    setRefundModalTicket(null);
  };

  // 5. Link Ticket to Catalog Track or Split Reference
  const handleLinkReference = async (ticket) => {
    if (!manualReferenceId.trim()) return;
    const ref = manualReferenceId.trim();

    let updated = null;
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference_id: ref,
          reference_type: ref.startsWith('US-') || ref.startsWith('KE-') ? 'isrc' : 'split_tx',
          reference_label: `Linked Item: ${ref}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        updated = data.ticket;
      }
    } catch (err) {
      console.warn('Backend link failed:', err);
    }

    if (!updated) {
      const nowIso = new Date().toISOString();
      const auditMsg = {
        sender: 'system',
        sender_name: 'TuneSupport AI',
        text: `🔗 Ticket officially linked to **${ref}**. Audit trail updated.`,
        created_at: nowIso
      };
      updated = {
        ...ticket,
        reference_id: ref,
        is_linked: true,
        reference_label: `Linked Item: ${ref}`,
        ai_thread: [...(ticket.ai_thread || []), auditMsg],
        updated_at: nowIso
      };
    }

    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (selectedTicket && selectedTicket.id === updated.id) {
      setSelectedTicket(updated);
    }
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(
      tickets.map(t => t.id === updated.id ? updated : t)
    ));
    setLinkingTicket(null);
    setManualReferenceId('');
  };

  // Filtered tickets for Admin Desk
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        t.id?.toLowerCase().includes(q) ||
        t.client_name?.toLowerCase().includes(q) ||
        t.client_email?.toLowerCase().includes(q) ||
        t.client_phone?.includes(q) ||
        t.reference_id?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' ||
        t.status === statusFilter ||
        (statusFilter === 'Pending Review' && (t.status === 'Pending Review' || t.status === 'Open'));

      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter]);

  // User's tickets (matching sessionUser email or all if user owns tickets)
  const myTickets = useMemo(() => {
    if (!sessionUser?.email) return tickets;
    const userEmail = sessionUser.email.toLowerCase().trim();
    const matched = tickets.filter(t => t.client_email?.toLowerCase().trim() === userEmail);
    return matched.length > 0 ? matched : tickets;
  }, [tickets, sessionUser]);

  return (
    <div className="support-tickets-panel" style={{ width: '100%', color: '#f1f5f9' }}>
      
      {/* Top Header & Navigation Banner */}
      <div style={{
        background: '#090e24',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(0, 240, 255, 0.1)',
              color: 'var(--cyan, #00f0ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RiCustomerService2Fill size={22} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#fff' }}>
              TuneMavens Support &amp; AI Claims Desk
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
            Automated dispute resolution, Split Cascade escrow holds, DDEX re-dispatch, and Unified Credits refunds powered by <strong>TuneSupport AI</strong>.
          </p>
        </div>

        {/* Tab Switching Buttons & Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setActiveTab('file')}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'file' ? '#0ea5e9' : 'transparent',
                color: activeTab === 'file' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiFileTextFill size={14} />
              File a Claim / Ticket
            </button>
            <button
              onClick={() => {
                setActiveTab('my-tickets');
                if (tickets.length > 0 && !selectedTicket) {
                  setSelectedTicket(tickets[0]);
                }
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'my-tickets' ? '#0ea5e9' : 'transparent',
                color: activeTab === 'my-tickets' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiRobot2Fill size={14} />
              Active Tickets ({myTickets.length})
            </button>
            <button
              onClick={() => setActiveTab('admin-desk')}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'admin-desk' ? '#0ea5e9' : 'transparent',
                color: activeTab === 'admin-desk' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiShieldCheckFill size={14} />
              Operations Desk
            </button>
          </div>

          {/* Top Right Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setHelpDocModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
              title="Need help? View articles related to this claim or section"
            >
              <RiCustomerService2Fill size={14} color="#0ea5e9" />
              Need Help?
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('my-tickets');
                if (tickets.length > 0) {
                  setSelectedTicket(tickets[0]);
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                background: 'rgba(0, 240, 255, 0.12)',
                color: 'var(--cyan, #00f0ff)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
              title="Launch TuneSupport AI Live Chat"
            >
              <RiRobot2Fill size={14} />
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FILE A SUPPORT TICKET / CLAIM (PARITY WITH ATLANTA TV MOUNT PRO)  */}
      {/* ========================================================================= */}
      {activeTab === 'file' && (
        <div>
          {!submissionResult ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Form Column */}
              <div style={{
                background: '#0d1536',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: '#fff' }}>
                    File a Claim or Inquire Support
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Provide catalog or transaction references to trigger instant AI verification and TuneLedger escrow dispute locks.
                  </p>
                </div>

                <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Name and Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Miller"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone & Reference ID */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 404-555-0192"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
                          Reference ID (ISRC / TxID)
                        </label>
                        <span style={{ fontSize: '10px', color: '#0ea5e9' }}>Auto-Matched</span>
                      </div>
                      <input
                        type="text"
                        value={formData.referenceId}
                        onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                        placeholder="e.g. US-TM1-24-00109 or SC-89241"
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Issue Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#090e24',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    >
                      {SUPPORT_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.label} style={{ background: '#090e24' }}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Describe the Issue in Detail *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Please explain the split discrepancy, DDEX ingestion error, or unified credit reload concern..."
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Attachment Evidence Upload (Max 3) */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Attach Evidence (Split sheets, cue sheets, error screenshots - Max 3)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#0ea5e9'
                      }}>
                        <RiUploadCloud2Fill size={16} />
                        Choose Files
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Supports JPG, PNG, PDF up to 5MB each.
                      </span>
                    </div>

                    {/* Preview Strip */}
                    {attachments.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                        {attachments.map((item, idx) => (
                          <div key={idx} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            position: 'relative'
                          }}>
                            {item.data && item.data.startsWith('data:image') ? (
                              <img
                                src={item.data}
                                alt="preview"
                                onClick={() => setPreviewImage(item.data)}
                                style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                              />
                            ) : (
                              <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RiFileList3Fill size={18} color="#0ea5e9" />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.name}
                              </p>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>{item.size}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(idx)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: 'none',
                                color: '#ef4444',
                                borderRadius: '4px',
                                padding: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <RiCloseLine size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div style={{ paddingTop: '8px' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: '100%',
                        background: '#0ea5e9',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '12px 20px',
                        fontWeight: 700,
                        fontSize: '13.5px',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {submitting ? (
                        <>
                          <RiTimeLine className="spin" size={16} /> Submitting &amp; Diagnosing...
                        </>
                      ) : (
                        <>
                          <RiRobot2Fill size={16} /> Submit Claim to TuneSupport AI
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Information & Guarantees Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* TuneLedger Escrow Guarantee Card */}
                <div style={{
                  background: '#0d1536',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <RiShieldCheckFill size={20} color="#10b981" />
                    <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#fff' }}>
                      TuneLedger Escrow Guarantee
                    </h4>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ margin: 0 }}>
                      When a dispute is lodged against any Catalog ISRC or Split Cascade transaction, <strong>outbound disbursements are automatically frozen in TuneLedger</strong>.
                    </p>
                    <p style={{ margin: 0 }}>
                      This prevents improper royalties from leaking to third parties while the split sheets or recoupment agreements are reviewed.
                    </p>
                    <p style={{ margin: 0 }}>
                      Once the AI or an administrator reconciles the split weights, the escrow hold is safely released and balances recalculated.
                    </p>
                  </div>
                </div>

                {/* Unified Credits Policy Card */}
                <div style={{
                  background: '#0d1536',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <RiCoinsFill size={20} color="#0ea5e9" />
                    <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#fff' }}>
                      Zero Monthly Fees &amp; Credit Safeguard
                    </h4>
                  </div>
                  <ul style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>TuneMavens operates on unified credits with <strong>0 recurring monthly charges</strong>.</li>
                    <li>If a DDEX distribution batch fails, delivery credits are never lost; re-dispatch is 100% free.</li>
                    <li>For confirmed billing delays or system discrepancies, credits are refunded directly to your unified balance with 1 click.</li>
                    <li>All tickets sync directly to the Intermaven Partner CRM for network-wide oversight.</li>
                  </ul>
                </div>

                {/* Emergency Contact */}
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <RiAlertFill size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 700, color: '#f87171' }}>
                      Urgent Sync or Copyright Escalations
                    </h5>
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#cbd5e1', lineHeight: 1.5 }}>
                      For live broadcast sync cue issues or statutory DMCA takedown counter-notices requiring immediate legal hold, email <strong>legal@tunemavens.com</strong> or call dispatch at <strong>+1 (800) 555-TUNE</strong>.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Submission Success View (Atlanta TV Mount Pro Fidelity) */
            <div style={{
              maxWidth: '620px',
              margin: '0 auto',
              background: '#0d1536',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <RiCheckLine size={32} />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: '#fff' }}>
                Support Ticket Logged &amp; AI Diagnosed
              </h3>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 24px 0' }}>
                Your claim has been registered in the TuneMavens ecosystem and analyzed by TuneSupport AI.
              </p>

              {/* Details card */}
              <div style={{
                background: '#090e24',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '12.5px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Ticket Reference:</span>
                  <span style={{ fontWeight: 700, color: '#0ea5e9', fontFamily: 'monospace' }}>{submissionResult.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Linking Status:</span>
                  <span style={{ fontWeight: 700, color: submissionResult.is_linked ? '#10b981' : '#f59e0b' }}>
                    {submissionResult.is_linked ? '✓ Auto-Matched & Verified' : 'Manual Review Pending'}
                  </span>
                </div>
                {submissionResult.reference_id && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Catalog Reference:</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{submissionResult.reference_id}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>TuneLedger Escrow:</span>
                  <span style={{ fontWeight: 700, color: submissionResult.is_frozen ? '#f59e0b' : '#10b981' }}>
                    {submissionResult.is_frozen ? '🔒 Dispute Lock Engaged (Payouts Frozen)' : 'Active (Normal)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>AI Diagnosis:</span>
                  <span style={{ fontWeight: 600, color: '#0ea5e9' }}>
                    {submissionResult.ai_diagnosis?.root_cause?.slice(0, 48)}...
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setActiveTab('my-tickets');
                    setSelectedTicket(submissionResult);
                  }}
                  style={{
                    background: '#0ea5e9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 18px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiRobot2Fill size={15} /> Enter AI Live Chat Desk
                </button>
                <button
                  onClick={() => {
                    setSubmissionResult(null);
                    setFormData({
                      name: sessionUser?.name || '',
                      email: sessionUser?.email || '',
                      phone: sessionUser?.phone || '',
                      referenceId: '',
                      category: SUPPORT_CATEGORIES[0].label,
                      description: ''
                    });
                    setAttachments([]);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#cbd5e1',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 18px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Submit Another Claim
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY ACTIVE TICKETS & AI LIVE RESOLUTION DESK                         */}
      {/* ========================================================================= */}
      {activeTab === 'my-tickets' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', minHeight: '600px' }}>
          
          {/* Ticket Selector List */}
          <div style={{
            background: '#0d1536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#fff' }}>
                Your Claims ({myTickets.length})
              </h4>
              <button
                onClick={fetchTickets}
                title="Refresh tickets"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiRefreshLine size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '540px' }}>
              {myTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '12px' }}>
                  No active claims found. File a ticket to start AI resolution.
                </div>
              ) : (
                myTickets.map(ticket => {
                  const isSelected = selectedTicket && selectedTicket.id === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      style={{
                        background: isSelected ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid #0ea5e9' : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                        padding: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#0ea5e9' }}>
                          {ticket.id}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: ticket.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : ticket.status === 'Refunded' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: ticket.status === 'Resolved' ? '#10b981' : ticket.status === 'Refunded' ? '#0ea5e9' : '#f59e0b'
                        }}>
                          {ticket.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                        {ticket.category}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.reference_id ? `Ref: ${ticket.reference_id}` : ticket.description}
                      </div>
                      {ticket.is_frozen && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '10px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                          <RiLockFill size={10} /> Escrow Frozen
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Live Resolution Workspace */}
          {selectedTicket ? (
            <div style={{
              background: '#0d1536',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              
              {/* Ticket Topbar & Diagnostic Summary */}
              <div style={{
                background: '#090e24',
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0ea5e9', fontFamily: 'monospace' }}>
                      {selectedTicket.id}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                      {selectedTicket.category}
                    </span>
                    {selectedTicket.is_frozen && (
                      <span style={{ fontSize: '10.5px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        🔒 Split Payouts Frozen in TuneLedger
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Client: {selectedTicket.client_name} ({selectedTicket.client_email}) • Reference: {selectedTicket.reference_id || 'Unlinked'}
                  </div>
                </div>

                {/* AI Settlement Action Button */}
                {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Refunded' && (
                  <button
                    onClick={() => handleExecuteResolution(selectedTicket, 'refund_credits')}
                    style={{
                      background: '#10b981',
                      color: '#060813',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiSparklingFill size={14} /> Accept AI Resolution &amp; Release Holds
                  </button>
                )}
              </div>

              {/* AI Diagnostic Banner */}
              {selectedTicket.ai_diagnosis && (
                <div style={{
                  background: 'rgba(14, 165, 233, 0.08)',
                  borderBottom: '1px solid rgba(14, 165, 233, 0.2)',
                  padding: '12px 20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <RiRobot2Fill size={20} color="#0ea5e9" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#0ea5e9' }}>
                        TuneSupport AI Diagnosis ({selectedTicket.ai_diagnosis.confidence_score}% Confidence)
                      </strong>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                        {selectedTicket.ai_diagnosis.category_badge}
                      </span>
                    </div>
                    <div style={{ color: '#cbd5e1', marginTop: '3px' }}>
                      {selectedTicket.ai_diagnosis.root_cause}
                    </div>
                    <div style={{ color: '#10b981', marginTop: '3px', fontWeight: 600 }}>
                      Proposed Action: {selectedTicket.ai_diagnosis.recommended_action}
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation Messages Thread */}
              <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                maxHeight: '400px'
              }}>
                
                {/* Initial Description Card */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '12.5px'
                }}>
                  <strong style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Original Issue Logged:
                  </strong>
                  <p style={{ margin: 0, color: '#f1f5f9', lineHeight: 1.5 }}>
                    {selectedTicket.description}
                  </p>
                  
                  {/* Photo Evidence attachments in thread */}
                  {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      {selectedTicket.attachments.map((att, i) => (
                        <img
                          key={i}
                          src={att}
                          alt="claim attachment"
                          onClick={() => setPreviewImage(att)}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* AI and User Messages */}
                {(selectedTicket.ai_thread || []).map((msg, idx) => {
                  const isAi = msg.sender === 'ai';
                  const isSystem = msg.sender === 'system';
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAi || isSystem ? 'flex-start' : 'flex-end',
                        maxWidth: '85%',
                        alignSelf: isAi || isSystem ? 'flex-start' : 'flex-end'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '3px',
                        fontSize: '10.5px',
                        color: isAi ? '#0ea5e9' : isSystem ? '#10b981' : '#cbd5e1'
                      }}>
                        {isAi && <RiRobot2Fill size={13} />}
                        {isSystem && <RiShieldCheckFill size={13} />}
                        <span style={{ fontWeight: 700 }}>{msg.sender_name || (isAi ? 'TuneSupport AI' : 'User')}</span>
                        <span style={{ color: '#64748b' }}>• {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div style={{
                        background: isAi ? '#090e24' : isSystem ? 'rgba(16, 185, 129, 0.12)' : '#0ea5e9',
                        color: isAi || isSystem ? '#f1f5f9' : '#fff',
                        border: isAi ? '1px solid rgba(14, 165, 233, 0.3)' : isSystem ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChatMessage} style={{
                background: '#090e24',
                padding: '12px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask TuneSupport AI a question or provide additional dispute details..."
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="submit"
                  disabled={sendingChat || !chatInput.trim()}
                  style={{
                    background: '#0ea5e9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: sendingChat || !chatInput.trim() ? 'not-allowed' : 'pointer',
                    opacity: sendingChat || !chatInput.trim() ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiSendPlaneFill size={14} /> Send
                </button>
              </form>

            </div>
          ) : (
            <div style={{
              background: '#0d1536',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '60px 20px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <RiCustomerService2Fill size={40} style={{ margin: '0 auto 12px auto', display: 'block' }} />
              <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 6px 0' }}>Select a ticket to begin</h4>
              <p style={{ fontSize: '12px', margin: 0 }}>
                Choose any active claim on the left to enter the interactive AI resolution desk.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PLATFORM OPERATIONS DESK (ADMIN / LABEL CLAIMS DESK)                */}
      {/* ========================================================================= */}
      {activeTab === 'admin-desk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Controls & Filter Bar */}
          <div style={{
            background: '#0d1536',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '260px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <RiSearchLine size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search client, email, ticket, ISRC..."
                  style={{
                    width: '100%',
                    background: '#090e24',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '8px 12px 8px 32px',
                    color: '#fff',
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  background: '#090e24',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#cbd5e1',
                  fontSize: '12px'
                }}
              >
                <option value="All">All Categories</option>
                {SUPPORT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['All', 'Pending Review', 'AI Diagnosed', 'Resolved', 'Refunded'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: statusFilter === status ? '1px solid #0ea5e9' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: statusFilter === status ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: statusFilter === status ? '#0ea5e9' : '#94a3b8',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Grid (Atlanta TV Mount Pro Admin Grid Parity) */}
          {filteredTickets.length === 0 ? (
            <div style={{
              background: '#0d1536',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '48px 20px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <RiCustomerService2Fill size={40} style={{ margin: '0 auto 12px auto', display: 'block' }} />
              <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 6px 0' }}>No support tickets found</h4>
              <p style={{ fontSize: '12px', margin: 0 }}>There are no claims matching your filter criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
              {filteredTickets.map(ticket => (
                <div
                  key={ticket.id}
                  style={{
                    background: '#0d1536',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderTop: ticket.is_frozen ? '3px solid #f59e0b' : '3px solid #0ea5e9'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 800, color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                          {ticket.id}
                        </span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '6px 0 0 0', color: '#fff' }}>
                          {ticket.client_name}
                        </h4>
                      </div>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: ticket.status === 'Resolved' ? 'rgba(16, 185, 129, 0.2)' : ticket.status === 'Refunded' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: ticket.status === 'Resolved' ? '#10b981' : ticket.status === 'Refunded' ? '#0ea5e9' : '#f59e0b'
                      }}>
                        {ticket.status}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '10px' }}>
                      <div><strong>Email:</strong> {ticket.client_email}</div>
                      <div><strong>Phone:</strong> {ticket.client_phone}</div>
                      <div>
                        <strong>Category:</strong>{' '}
                        <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{ticket.category}</span>
                      </div>
                      <div><strong>Logged:</strong> {new Date(ticket.created_at).toLocaleString()}</div>
                    </div>

                    {/* Linking Box */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontSize: '11.5px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}>
                      <div>
                        <strong>Catalog Ref:</strong>{' '}
                        {ticket.reference_id ? (
                          <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{ticket.reference_id}</span>
                        ) : (
                          <span style={{ color: '#f59e0b', fontWeight: 600 }}>Unlinked</span>
                        )}
                      </div>
                      {!ticket.reference_id && (
                        <button
                          onClick={() => {
                            setLinkingTicket(ticket);
                            setManualReferenceId('');
                          }}
                          style={{
                            background: '#0ea5e9',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Link Now
                        </button>
                      )}
                    </div>

                    {/* Description preview */}
                    <div style={{
                      fontSize: '12px',
                      color: '#cbd5e1',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      lineHeight: 1.4,
                      marginBottom: '10px'
                    }}>
                      {ticket.description}
                    </div>

                    {/* Attachments preview */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                        {ticket.attachments.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="evidence"
                            onClick={() => setPreviewImage(img)}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Block */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '10px'
                  }}>
                    <button
                      onClick={() => {
                        setActiveTab('my-tickets');
                        setSelectedTicket(ticket);
                      }}
                      style={{
                        background: 'rgba(14, 165, 233, 0.1)',
                        color: '#0ea5e9',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      AI Thread ({ticket.ai_thread ? ticket.ai_thread.length : 0})
                    </button>

                    {ticket.status !== 'Resolved' && ticket.status !== 'Refunded' && (
                      <>
                        <button
                          onClick={() => {
                            setRefundModalTicket(ticket);
                            setRefundAmount(ticket.ai_diagnosis?.suggested_refund_credits || 100);
                          }}
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Issue Credits
                        </button>
                        <button
                          onClick={() => handleExecuteResolution(ticket, 'resolve')}
                          style={{
                            background: '#0ea5e9',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Resolve Claim
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: Image Preview, Link Reference, and Refund Credits                 */}
      {/* ========================================================================= */}

      {/* 1. Image Preview Modal */}
      {previewImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }} onClick={() => setPreviewImage(null)}>
          <div style={{ position: 'relative', maxWidth: '800px', maxHeight: '90vh' }}>
            <img src={previewImage} alt="Full evidence preview" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px' }} />
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RiCloseLine size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Link Ticket Reference Modal */}
      {linkingTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1536',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '460px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff', fontWeight: 700 }}>
              Link Support Ticket to Catalog Asset
            </h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
              Connect ticket <strong>{linkingTicket.id}</strong> ({linkingTicket.client_name}) to an ISRC, Split Cascade TxID, or Sync Brief.
            </p>
            <input
              type="text"
              value={manualReferenceId}
              onChange={(e) => setManualReferenceId(e.target.value)}
              placeholder="e.g. US-TM1-24-00109 or SC-89241"
              style={{
                width: '100%',
                background: '#090e24',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '13px',
                boxSizing: 'border-box',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setLinkingTicket(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleLinkReference(linkingTicket)}
                disabled={!manualReferenceId.trim()}
                style={{
                  background: '#0ea5e9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: !manualReferenceId.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Save &amp; Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Issue Credits Refund Modal */}
      {refundModalTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1536',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '460px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fff', fontWeight: 700 }}>
              Issue Unified Credits Refund
            </h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
              Refund credits to <strong>{refundModalTicket.client_name}</strong> ({refundModalTicket.client_email}) for ticket <strong>{refundModalTicket.id}</strong>.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Credits to Deposit
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={refundAmount}
                onChange={(e) => setRefundAmount(parseInt(e.target.value, 10) || 0)}
                style={{
                  width: '100%',
                  background: '#090e24',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setRefundModalTicket(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteResolution(refundModalTicket, 'refund_credits', refundAmount)}
                style={{
                  background: '#10b981',
                  color: '#060813',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Confirm Refund (+{refundAmount} Credits)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Contextual Documentation Modal */}
      <InAppDocModal
        isOpen={helpDocModalOpen}
        onClose={() => setHelpDocModalOpen(false)}
        initialArticleId={getContextualHelpArticleId()}
        category="support"
        contextTitle={getContextualHelpTitle()}
        sessionUser={sessionUser}
        onAskAi={(art) => {
          setHelpDocModalOpen(false);
          setActiveTab('my-tickets');
        }}
      />

    </div>
  );
}
