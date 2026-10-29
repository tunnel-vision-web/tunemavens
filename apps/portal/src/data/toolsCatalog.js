import {
  RiRadioFill,
  RiCpuFill,
  RiFileTextFill,
  RiKey2Fill,
  RiSettings3Fill,
  RiBarChartFill,
  RiLockFill,
  RiTerminalFill,
  RiGlobalFill,
} from 'react-icons/ri';

export const TOOLS_CATALOG = [
  {
    id: 'artist-one-sheet',
    name: 'Artist One-Sheet AI',
    icon: RiFileTextFill,
    role: 'creator',
    roleLabel: 'Independent Creator',
    appSlug: 'epk-builder',
    tab: 'epk-builder',
    cost: '5 credits',
    isFree: false,
    desc: 'Compiles your brand and catalog details into a clean PDF one-sheet pitch document for booking agents and sync supervisors.',
    highlights: [
      'Export high-resolution PDF pitch sheets',
      'Auto-sync streaming telemetry & EPK catalog',
      'Direct sync supervisor submission link'
    ],
    guidance: 'Creator seat & EPK Builder pre-selected. Generate your one-sheet pitch in seconds.',
    sampleData: {
      artistName: 'Alex Rivera',
      genre: 'Afro-House / Deep Tech',
      location: 'Nairobi, Kenya',
      stats: '350,000+ Streams · BBC 1Xtra Feature · Boiler Room Nairobi',
      topTracks: [
        { title: 'Nairobi Sunset Groove', isrc: 'KE-TM1-26-0001', splits: '100% Verified' },
        { title: 'Kilifi Drift', isrc: 'KE-TM1-26-0002', splits: '100% Verified' },
        { title: 'Savannah Pulse', isrc: 'KE-TM1-26-0003', splits: '100% Verified' },
      ],
      syncReadiness: '100% Pre-Cleared One-Stop'
    }
  },
  {
    id: 'sync-brief-ai',
    name: 'Sync Brief AI',
    icon: RiRadioFill,
    role: 'studio',
    roleLabel: 'Music Supervisor / Studio',
    appSlug: 'sync-marketplace',
    tab: 'sync',
    cost: '10 credits',
    isFree: false,
    desc: 'Translates video descriptions and creative scripts into specific sync descriptors and matched master tracks.',
    highlights: [
      'Natural language brief parsing',
      'AI mood, tempo, and scene taxonomy',
      'Instant one-stop master licensing match'
    ],
    guidance: 'Music Supervisor seat pre-selected with access to SyncMavens pre-cleared catalog.',
    sampleData: {
      sceneDesc: 'High-energy cinematic chase scene set in Nairobi downtown, driving percussion, modern afro-drill tempo.',
      recommendedBpm: '135 - 142 BPM',
      matchedVibe: 'Cinematic Afro-Drill / Action Drama'
    }
  },
  {
    id: 'mastering-brief-ai',
    name: 'Mastering Brief AI',
    icon: RiCpuFill,
    role: 'creator',
    roleLabel: 'Independent Creator',
    appSlug: 'catalog-porting',
    tab: 'catalog',
    cost: '15 credits',
    isFree: false,
    desc: 'Optimizes output loudness targets (LUFS) and peaks based on reference tracks for commercial DSP compliance.',
    highlights: [
      'Apple Music & Spotify -14 LUFS targets',
      'True Peak (-1.0 dBTP) clipping prevention',
      'Stereo width & dynamic range diagnostics'
    ],
    guidance: 'Creator seat pre-selected with catalog mastering diagnostics.',
  },
  {
    id: 'remix-license-generator',
    name: 'Remix License Generator',
    icon: RiKey2Fill,
    role: 'dj',
    roleLabel: 'DJ & Remixer',
    appSlug: 'escrow-contracts',
    tab: 'clearance',
    cost: 'Free',
    isFree: true,
    desc: 'Generates stem clearance and royalty share contracts for collaborative remixes and bootlegs.',
    highlights: [
      '50/50 net master remix templates',
      'Verified stem download escrow clearances',
      'Instant e-signature execution'
    ],
    guidance: 'DJ seat pre-selected with instant stem clearance contract generation.',
  },
  {
    id: 'broadcast-report-formatter',
    name: 'Broadcast Report Formatter',
    icon: RiSettings3Fill,
    role: 'media',
    roleLabel: 'Media House & Broadcaster',
    appSlug: 'corporate-ads',
    tab: 'corporate-ads',
    cost: 'Free',
    isFree: true,
    desc: 'Formats and compiles broadcast playlogs to fit compliance reporting sheets for local and global CMOs.',
    highlights: [
      'KAMP & PRISK compliance templates',
      'Automated cue sheet exports',
      '24-hour playlog auditing'
    ],
    guidance: 'Media House seat pre-selected with automated CMO playlog formatting.',
  },
  {
    id: 'royalty-statement-ai',
    name: 'Royalty Statement AI',
    icon: RiBarChartFill,
    role: 'label',
    roleLabel: 'Record Label',
    appSlug: 'split-cascade',
    tab: 'splits',
    cost: '20 credits',
    isFree: false,
    desc: 'Audits bulk royalty statement payouts and exports split ledgers with automated contributor cascades.',
    highlights: [
      'CSV / DDEX ingestion audits',
      'Basis point cascade verification (10,000 bps)',
      'Recoupment deduction ledger'
    ],
    guidance: 'Record Label seat pre-selected with automated split cascade accounting.',
  },
  {
    id: 'release-planner',
    name: 'Release Planner',
    icon: RiFileTextFill,
    role: 'creator',
    roleLabel: 'Independent Creator',
    appSlug: 'catalog-porting',
    tab: 'catalog',
    cost: 'Free',
    isFree: true,
    desc: 'Coordinates store distribution deadlines, presave campaigns, and media embargo dates.',
    highlights: [
      '4-week rollout campaign calendar',
      'DSP delivery deadline reminders',
      'Embargo management'
    ],
    guidance: 'Creator seat pre-selected with release milestone planner.',
  },
  {
    id: 'music-nft-brief',
    name: 'Music NFT Brief',
    icon: RiLockFill,
    role: 'creator',
    roleLabel: 'Independent Creator',
    appSlug: 'catalog-porting',
    tab: 'catalog',
    cost: '25 credits',
    isFree: false,
    desc: 'Designs metadata token structures for web3 releases and catalog registration.',
    highlights: [
      'ERC-721/1155 metadata standards',
      'Unlockable master audio stems',
      'Immutable split attribution'
    ],
    guidance: 'Creator seat pre-selected with web3 metadata registration.',
  },
  {
    id: 'isrc-generator',
    name: 'ISRC Generator',
    icon: RiTerminalFill,
    role: 'creator',
    roleLabel: 'Independent Creator',
    appSlug: 'catalog-porting',
    tab: 'catalog',
    cost: 'Free',
    isFree: true,
    desc: 'Allocates and registers validated track tracking codes conforming strictly to international standards.',
    highlights: [
      'Standard 12-char ISRC code allocation',
      'Batch code generator',
      'DSP delivery export'
    ],
    guidance: 'Creator seat pre-selected with validated ISRC generation.',
  },
  {
    id: 'playlist-pitch-ai',
    name: 'Playlist Pitch AI',
    icon: RiGlobalFill,
    role: 'creator',
    roleLabel: 'Independent Creator',
    appSlug: 'sync-marketplace',
    tab: 'sync',
    cost: '10 credits',
    isFree: false,
    desc: 'Automates curator pitching emails based on your genre tags and references.',
    highlights: [
      'Personalized editorial curator angles',
      'Genre & vibe taxonomy mapping',
      'Follow-up tracking templates'
    ],
    guidance: 'Creator seat pre-selected with curator pitching automation.',
  }
];

export function getToolById(id) {
  if (!id) return null;
  const clean = id.toLowerCase().trim();
  return TOOLS_CATALOG.find(t => t.id === clean || t.id.replace(/-/g, '') === clean.replace(/-/g, '')) || null;
}
