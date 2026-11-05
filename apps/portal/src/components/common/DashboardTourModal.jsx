import React, { useState, useEffect } from 'react';
import {
  RiCompass3Line,
  RiSparklingLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiRefreshLine,
  RiMicFill,
  RiDiscFill,
  RiEqualizerFill,
  RiRadioFill,
  RiMegaphoneFill,
  RiGlobalFill,
  RiCoinsFill,
  RiFundsBoxFill,
  RiHeadphoneFill,
  RiShieldFill,
} from 'react-icons/ri';

export const PERSONA_TOUR_DATA = {
  creator: {
    label: 'Creator / Artist & Producer',
    icon: RiMicFill,
    color: '#22d3ee',
    steps: [
      {
        title: 'Welcome to TuneMavens Studio',
        badge: 'Studio Command',
        tab: 'epk-builder',
        description: 'Welcome to your complete music business operating system! Here you manage your artist identity, lossless master distribution, automated split waterfalls, and sync licensing opportunities.',
        highlight: 'Your all-in-one music career launchpad',
      },
      {
        title: 'Digital Press Kit & EPK Studio',
        badge: 'Artist Identity',
        tab: 'epk-builder',
        description: 'Design a verified, responsive Electronic Press Kit (EPK) with high-res hero banners, bios, social embeds, audio showcases, and downloadable press assets ready for record labels and festival booking agents.',
        highlight: 'One-click public URL ready for industry pitching',
      },
      {
        title: 'Catalogue Porting & Audio Ingestion',
        badge: 'Global Distribution',
        tab: 'catalog-porting',
        description: 'Upload high-fidelity WAV or FLAC masters, validate ISRC codes, customize release artwork, and deploy directly across 150+ global DSPs (Spotify, Apple Music, Boomplay, Audiomack) with zero middleman deductions.',
        highlight: 'ISRC validation and lossless stem storage',
      },
      {
        title: 'Split Cascade & Payout Waterfalls',
        badge: 'TuneLedger Liquidity',
        tab: 'split-cascade',
        description: 'Set programmatic, waterfall royalty splits. Automatically recoup studio recording outlays first, disburse producer points, and stream net master and publishing equity straight to collaborator M-Pesa STK or bank accounts.',
        highlight: 'Eliminate split disputes with automated accounting',
      },
      {
        title: 'Communications Vault & Real-Time WhatsApp Alerts',
        badge: 'Omnichannel Alerts',
        tab: 'communications-vault',
        description: 'Receive instant deal offers, placement notices, and contract updates directly on your smartphone via WhatsApp or email. Complete your 1-click inbound handshake in the vault to open your free 24-hour customer service window.',
        highlight: 'Direct push notifications for high-velocity sync deals',
      },
    ],
  },

  supervisor: {
    label: 'Music Supervisor',
    icon: RiEqualizerFill,
    color: '#ec4899',
    steps: [
      {
        title: 'Music Supervisor Sync Suite',
        badge: 'Sync Licensing',
        tab: 'sync-marketplace',
        description: 'Welcome to the Music Supervisor Portal. Search, audition, and license 100% pre-cleared, one-stop indie masters and publisher-cleared works for film, television, games, and streaming commercials.',
        highlight: 'Pre-cleared masters with zero copyright friction',
      },
      {
        title: 'Sync Marketplace & Search Filters',
        badge: 'Smart Discovery',
        tab: 'sync-marketplace',
        description: 'Filter thousands of authentic tracks by tempo, musical key, vocal type, emotional mood, cue points, and regional authenticity (Afro-fusion, Amapiano, Benga, Drill). Audition lossless audio and download stems on demand.',
        highlight: 'Instant stem preview and cue sheet metadata',
      },
      {
        title: 'Escrow Contracts & 1-Click Clearances',
        badge: 'Legal Clearance',
        tab: 'escrow-contracts',
        description: 'Issue standardized synchronization contracts backed by programmatic TuneLedger escrow. Counterparties sign digitally with instant legal clearance, indemnifying your production against copyright disputes.',
        highlight: 'Automated escrow protection and signed PDF licenses',
      },
      {
        title: 'Complimentary VIP WhatsApp Dispatch',
        badge: 'VIP Messaging',
        tab: 'communications-vault',
        description: 'Music supervisors enjoy complimentary, unlimited WhatsApp messaging across our network. Negotiate directly with artist teams, request custom edits, and receive split clearances in minutes.',
        highlight: '100% free VIP WhatsApp delivery with zero credit reload fees',
      },
    ],
  },

  label: {
    label: 'Record Label / Publisher',
    icon: RiDiscFill,
    color: '#a855f7',
    steps: [
      {
        title: 'Record Label Roster Operations',
        badge: 'Roster Command',
        tab: 'label-team',
        description: 'Manage your multi-artist roster, mechanical rights, global distribution pipelines, and master collections from one central operational console.',
        highlight: 'Multi-artist administration and team access controls',
      },
      {
        title: 'Catalogue Porting & Batch Ingestion',
        badge: 'Batch Distribution',
        tab: 'catalog-porting',
        description: 'Batch-port catalogue albums, assign and validate ISRC and ISWC metadata, update release artwork across entire discographies, and monitor DSP ingestion statuses in real time.',
        highlight: 'High-throughput catalogue deployment across all global DSPs',
      },
      {
        title: 'Programmatic Advance Recoupment',
        badge: 'Advance Recoupment',
        tab: 'split-cascade',
        description: 'Track artist advance balances and recoupment velocity with programmatic accuracy. TuneLedger automatically sweeps 100% of incoming master revenues toward recoupment before distributing profit shares.',
        highlight: 'Zero manual spreadsheet accounting or payout delays',
      },
      {
        title: 'Sync Pitching & Global Brand Opportunities',
        badge: 'Commercial Sync',
        tab: 'sync-marketplace',
        description: 'Pitch your label roster directly into Hollywood, European, and regional commercial sync briefs. Submit pre-cleared tracks with confirmed splits to lock high-value synchronization fees.',
        highlight: 'Commercial brand deals and television cue placements',
      },
      {
        title: 'Complimentary VIP Communications',
        badge: 'VIP Communications',
        tab: 'communications-vault',
        description: 'Record labels receive complimentary VIP WhatsApp push notifications for signed contracts, delivery receipts, and sync deal inquiries without wallet balance constraints.',
        highlight: 'Real-time multi-channel notifications across email and WhatsApp',
      },
    ],
  },

  corporate: {
    label: 'Corporate Brand / Advertiser',
    icon: RiMegaphoneFill,
    color: '#f97316',
    steps: [
      {
        title: 'Corporate Brand Music & Sponsorship Suite',
        badge: 'Brand Licensing',
        tab: 'corporate-ads',
        description: 'License authentic commercial music and partner with leading audio creators for radio, television, digital campaigns, and experiential sponsorships with full legal indemnity.',
        highlight: 'Legally cleared commercial sound for corporate campaigns',
      },
      {
        title: 'Curated Sync Brief Publishing',
        badge: 'Custom Briefs',
        tab: 'sync-marketplace',
        description: 'Publish custom commercial music briefs and creative moodboards directly to verified creators and record labels to commission bespoke brand sonic identities and anthems.',
        highlight: 'Direct commissioning of sonic branding from top creators',
      },
      {
        title: 'Escrow Settlements & Invoicing',
        badge: 'Safe Escrow',
        tab: 'escrow-contracts',
        description: 'Fund commercial licensing budgets securely through TuneLedger escrow accounts. Funds disburse to creators only upon verified delivery and commercial broadcast clearances.',
        highlight: 'Zero-risk milestone payments with automated tax invoices',
      },
      {
        title: 'VIP Direct Omnichannel Communications',
        badge: 'VIP Support',
        tab: 'communications-vault',
        description: 'Corporate marketing teams enjoy complimentary VIP WhatsApp and priority email channels to coordinate urgent commercial clearance deadlines.',
        highlight: '100% complimentary VIP access for corporate brands',
      },
    ],
  },

  dj: {
    label: 'DJ / Curator',
    icon: RiRadioFill,
    color: '#f59e0b',
    steps: [
      {
        title: 'DJ Pool & Curation Studio',
        badge: 'DJ Pool Access',
        tab: 'djpool',
        description: 'Access exclusive club edits, extended intros, clean radio passes, instrumentals, and lossless DJ drops formatted for Serato, Rekordbox, and Traktor.',
        highlight: 'Club-ready audio masters curated directly from producers',
      },
      {
        title: 'Lossless Library & Key / BPM Detection',
        badge: 'Fidelity & Tags',
        tab: 'tunemavens-library',
        description: 'Browse lossless tracks complete with exact Camelot musical keys, BPM values, energy ratings, and genre tags for seamless harmonic mixing.',
        highlight: 'Audiophile audio files with precise harmonic metadata',
      },
      {
        title: 'Direct Creator Tip Jars',
        badge: 'Artist Tips',
        tab: 'tunemavens-tips',
        description: 'Send direct tips via M-Pesa STK or card straight to independent producers whose tracks ignite your live sets, forging direct creative partnerships.',
        highlight: '100% direct tips delivered to artists without middleman cuts',
      },
    ],
  },

  podcaster: {
    label: 'Podcaster / Show Host',
    icon: RiMicFill,
    color: '#ec4899',
    steps: [
      {
        title: 'Podcaster Studio & Episode Distribution',
        badge: 'Podcast Studio',
        tab: 'podcaster-studio',
        description: 'Manage show feeds, publish podcast episodes with lossless audio masters, and distribute across Spotify, Apple Podcasts, and Google Podcasts seamlessly.',
        highlight: 'Automated RSS distribution and high-fidelity mastering',
      },
      {
        title: 'Podcast EPK & Sponsor Pitch Deck',
        badge: 'Sponsor Deck',
        tab: 'podcaster-epk',
        description: 'Showcase your show metrics, audience demographics, monthly download velocity, and host-read rate cards to attract premium advertising sponsors.',
        highlight: 'Public verified press kit ready for corporate ad buyers',
      },
      {
        title: 'Corporate Ad Slot Marketplace',
        badge: 'Ad Monetization',
        tab: 'corporate-ads',
        description: 'Connect with verified corporate advertisers seeking pre-roll, mid-roll, and host-read sponsorship placements on top regional podcasts.',
        highlight: 'Programmatic ad placement with direct escrow settlements',
      },
    ],
  },

  media_house: {
    label: 'Media House & Broadcaster',
    icon: RiGlobalFill,
    color: '#10b981',
    steps: [
      {
        title: 'Broadcaster Music Operations',
        badge: 'Broadcast Hub',
        tab: 'sync-marketplace',
        description: 'Streamline music cue sheets, commercial broadcast licensing, and royalty compliance across television networks, radio stations, and digital channels.',
        highlight: 'Broadcaster-grade licensing with comprehensive legal indemnity',
      },
      {
        title: 'Pre-Cleared Commercial Vault',
        badge: 'Broadcast Scores',
        tab: 'sync-marketplace',
        description: 'Instant access to television-cleared background scores, theme music, and broadcast stingers with verified master and publishing rights metadata.',
        highlight: 'Instantly auditable music library ready for airplay',
      },
      {
        title: 'Automated Cue Sheets & Compliance',
        badge: 'CMO Compliance',
        tab: 'escrow-contracts',
        description: 'Export certified broadcast logs and cue sheet reports for regional CMOs (MCSK, KAMP, PRISK, PRS) in seconds, eliminating compliance headaches.',
        highlight: 'One-click cue sheet generation for royalty reporting',
      },
    ],
  },

  affiliate: {
    label: 'Affiliate Partner / Creator Scout',
    icon: RiCoinsFill,
    color: '#22d3ee',
    steps: [
      {
        title: 'Affiliate & Ambassador Command Console',
        badge: 'Commission Hub',
        tab: 'affiliates',
        description: 'Earn recurring 3% to 12% multi-stream commissions modeled on Ditto Music\'s partner framework across streaming, lossless sales, sync licensing, and VIP tour passes.',
        highlight: 'Multi-stream recurring commissions on all referred commerce',
      },
      {
        title: 'Referral Engine & 90-Day Tracking Cookies',
        badge: 'Cookie Attribution',
        tab: 'affiliates',
        description: 'Generate campaign-specific referral links with persistent 90-day tracking cookies operating seamlessly across TuneMavens, TuneStream, and SyncMavens.',
        highlight: 'Persistent 90-day cross-domain cookie attribution',
      },
      {
        title: 'Real-Time Payout Rails & Mobile STK',
        badge: 'Instant Liquidity',
        tab: 'affiliates',
        description: 'Track earned commissions on TuneLedger in real time and initiate instant automated disbursements to M-Pesa STK or global bank accounts.',
        highlight: 'Zero minimum payout wait times via mobile money STK',
      },
    ],
  },

  vc: {
    label: 'Tour Venture Capital (VC) & Investor',
    icon: RiFundsBoxFill,
    color: '#00f2fe',
    steps: [
      {
        title: 'Tour Capital & Senior Debt Syndicate Vault',
        badge: 'Tour Capital',
        tab: 'tours-vault',
        description: 'Deploy institutional capital into high-velocity live concert tours, music festivals, and artist advances backed by senior-secured box-office liquidation waterfalls.',
        highlight: 'Institutional LP facilities with 24% target IRR metrics',
      },
      {
        title: 'Automated Split Cascade Recoupment',
        badge: 'Waterfall Liquidity',
        tab: 'split-cascade',
        description: 'Monitor tour box-office velocity and recoupment milestones in real time. 100% of initial ticket revenues sweep automatically to repay principal plus target IRR.',
        highlight: 'Programmatic principal sweep before artist profit distribution',
      },
      {
        title: 'Creator Discovery & Growth Telemetry',
        badge: 'Growth Analytics',
        tab: 'vc-discover',
        description: 'Identify breakout touring artists using cross-platform telemetry, streaming acceleration, and historical box-office sell-through velocities.',
        highlight: 'Data-driven underwriting for live music advance syndicates',
      },
    ],
  },

  consumer: {
    label: 'Consumer / Fan',
    icon: RiHeadphoneFill,
    color: '#6366f1',
    steps: [
      {
        title: 'TuneStream 24-Bit Lossless Player',
        badge: 'Lossless Audio',
        tab: 'stream-controls',
        description: 'Experience studio-master lossless streaming audio with audiophile fidelity, dynamic synced lyrics, and interactive liner notes from creators worldwide.',
        highlight: 'Audiophile 24-bit audio playback direct from the master studio',
      },
      {
        title: 'Direct Creator Tip Jars',
        badge: '100% Direct Tips',
        tab: 'tips',
        description: 'Send direct tips to your favorite independent musicians via M-Pesa or card. 100% of your tip goes directly to the creator with zero platform deduction.',
        highlight: 'Empower independent artists directly with instant micro-tips',
      },
      {
        title: 'Concert Tickets & VIP Tour Passes',
        badge: 'Live Events',
        tab: 'concerts',
        description: 'Book VIP tour passes, concert tickets, and hands-on production masterclasses with touring musicians directly through the platform.',
        highlight: 'Exclusive VIP access to concert soundchecks and workshops',
      },
    ],
  },

  admin: {
    label: 'Platform Administrator',
    icon: RiShieldFill,
    color: '#38bdf8',
    steps: [
      {
        title: 'Global Platform Command & Telemetry',
        badge: 'System Overseer',
        tab: 'admin-dashboard',
        description: 'Monitor all 14 ecosystem applications, multi-domain routing, MongoDB Atlas replica sets, Sentry exception telemetry, and live health check probes.',
        highlight: 'Real-time cloud infrastructure monitoring and health telemetry',
      },
      {
        title: 'Persona Simulator & Live Role Switching',
        badge: 'Persona Simulator',
        tab: 'admin-dashboard',
        description: 'Seamlessly switch into any persona (Creator, Label, Supervisor, Corporate, DJ, VC) with 1-click simulation to audit tools, permissions, and user onboarding.',
        highlight: 'Instant audit verification of every persona workspace',
      },
      {
        title: 'Communications Vault & Meta Webhook Telemetry',
        badge: 'Audit Vault',
        tab: 'communications-vault',
        description: 'Inspect live email deliverability, Meta WhatsApp webhook handshake events, 1,000-message monthly quota limits, and complete audit ledgers across all users.',
        highlight: 'Authoritative audit trail for all transactional communications',
      },
      {
        title: 'Role Tiers, KYC & Dispute Settlement',
        badge: 'Platform Governance',
        tab: 'contracts',
        description: 'Audit contracts, manage payout disbursements, verify creator credentials, configure role tiers, and resolve copyright disputes across the ecosystem.',
        highlight: 'Comprehensive governance across all ecosystem transactions',
      },
    ],
  },
};

export default function DashboardTourModal({
  isOpen,
  onClose,
  currentRole = 'creator',
  setActiveTab,
}) {
  const personaData = PERSONA_TOUR_DATA[currentRole] || PERSONA_TOUR_DATA.creator;
  const steps = personaData.steps || [];
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to step 0 whenever the modal opens or role changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      // Automatically switch to first step's tab if specified
      if (steps[0]?.tab && typeof setActiveTab === 'function') {
        setActiveTab(steps[0].tab);
      }
    }
  }, [isOpen, currentRole]);

  // Handle ESC key to dismiss tour
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleEndTour();
      } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, steps.length]);

  if (!isOpen || steps.length === 0) return null;

  const step = steps[currentStep];
  const PersonaIcon = personaData.icon || RiCompass3Line;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (!isLast) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      const nextTab = steps[nextStepIndex]?.tab;
      if (nextTab && typeof setActiveTab === 'function') {
        setActiveTab(nextTab);
      }
    } else {
      handleEndTour();
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      const prevTab = steps[prevStepIndex]?.tab;
      if (prevTab && typeof setActiveTab === 'function') {
        setActiveTab(prevTab);
      }
    }
  };

  const handleEndTour = () => {
    try {
      localStorage.setItem(`tunemavens_tour_completed_${currentRole}`, 'true');
    } catch (_) {}
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div
      onClick={handleEndTour}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Exactly .8 opacity as specified
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out',
      }}
      data-testid="dashboard-tour-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #0d1522 0%, #080d16 100%)',
          border: `1px solid ${personaData.color}55`,
          borderRadius: '12px',
          maxWidth: '560px',
          width: '100%',
          padding: '28px 30px',
          boxShadow: `0 24px 60px rgba(0,0,0,0.8), 0 0 35px ${personaData.color}22`,
          position: 'relative',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
        data-testid="dashboard-tour-card"
      >
        {/* Top Header: Persona Badge, Step Counter & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: `${personaData.color}22`,
              border: `1px solid ${personaData.color}55`,
              color: personaData.color,
              padding: '6px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              <PersonaIcon size={15} />
              <span>{personaData.label}</span>
            </div>
            <span style={{
              fontSize: '11px',
              background: 'rgba(255,255,255,0.08)',
              color: '#94a3b8',
              padding: '3px 8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: 700,
            }}>
              {step.badge}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontFamily: 'monospace',
              fontWeight: 700,
            }}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleEndTour}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'color 0.15s ease',
              }}
              title="End Tour (ESC)"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                if (steps[idx]?.tab && typeof setActiveTab === 'function') {
                  setActiveTab(steps[idx].tab);
                }
              }}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: idx === currentStep 
                  ? personaData.color 
                  : (idx < currentStep ? `${personaData.color}77` : 'rgba(255,255,255,0.12)'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main Body: Step Title & Detailed Content */}
        <div style={{ margin: '4px 0' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#f8fafc',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <RiSparklingLine size={22} style={{ color: personaData.color }} />
            <span>{step.title}</span>
          </h2>

          <p style={{
            fontSize: '14px',
            lineHeight: 1.65,
            color: '#cbd5e1',
            margin: '0 0 14px 0',
          }}>
            {step.description}
          </p>

          {/* Key Value Spotlight Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderLeft: `3px solid ${personaData.color}`,
            borderRadius: '0 6px 6px 0',
            padding: '10px 14px',
            fontSize: '12px',
            color: '#e2e8f0',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ color: personaData.color, fontSize: '14px' }}>💡</span>
            <span>{step.highlight}</span>
          </div>
        </div>

        {/* Footer Actions: End Tour, Prev, Next */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '16px',
          marginTop: '6px',
        }}>
          <button
            type="button"
            onClick={handleEndTour}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'color 0.15s ease',
            }}
          >
            End Tour
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              style={{
                background: '#1e293b',
                color: isFirst ? '#475569' : '#e2e8f0',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: isFirst ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isFirst ? 0.5 : 1,
              }}
            >
              <RiArrowLeftLine size={14} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              style={{
                background: personaData.color,
                color: '#080d16',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 4px 14px ${personaData.color}44`,
                transition: 'all 0.15s ease',
              }}
            >
              <span>{isLast ? 'Finish Tour' : 'Next'}</span>
              {isLast ? <RiCheckLine size={15} /> : <RiArrowRightLine size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
