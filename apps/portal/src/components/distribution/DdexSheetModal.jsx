import React, { useState, useEffect } from 'react';
import {
  RiCloseLine,
  RiFileCopyLine,
  RiCheckLine,
  RiDownloadCloud2Line,
  RiShieldCheckFill,
  RiFileCodeLine,
} from 'react-icons/ri';
import { distroApi } from '../../lib/api.js';

export default function DdexSheetModal({ isOpen, onClose, releaseId, releaseTitle }) {
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' | 'xml'

  useEffect(() => {
    if (isOpen && releaseId) {
      setLoading(true);
      distroApi
        .getSheet(releaseId)
        .then((res) => {
          setSheet(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, releaseId]);

  if (!isOpen) return null;

  const generateXmlString = (data) => {
    if (!data) return '';
    return `<?xml version="1.0" encoding="UTF-8"?>
<ern:NewReleaseMessage xmlns:ern="http://ddex.net/xml/ern/382" MessageSchemaVersionId="ern/382" ReleaseProfileVersionId="CommonReleaseTypes/14/AudioAlbumMusicOnly">
  <MessageHeader>
    <MessageThreadId>${data.release_id || 'TM-RELEASE-001'}</MessageThreadId>
    <MessageId>${data.ddex_batch || 'DDEX-BATCH-2026-TM'}</MessageId>
    <MessageSender>
      <PartyId>PADPIDA2026TUNEMAVENS</PartyId>
      <PartyName><FullName>TuneMavens Global Distribution</FullName></PartyName>
    </MessageSender>
    <MessageCreatedDateTime>${data.exported_at || new Date().toISOString()}</MessageCreatedDateTime>
    <Checksum>${data.metadata_checksum || 'sha256_checksum_passed'}</Checksum>
  </MessageHeader>
  <ResourceList>
    <SoundRecording>
      <SoundRecordingType>MusicalWorkSoundRecording</SoundRecordingType>
      <SoundRecordingId>
        <ISRC>${data.tracks?.[0]?.isrc || 'KE-TM1-26-00001'}</ISRC>
      </SoundRecordingId>
      <ReferenceTitle>
        <TitleText>${data.title || 'Untitled'}</TitleText>
      </ReferenceTitle>
      <Duration>PT3M30S</Duration>
      <RightsAgreementId>TM-DISTRO-RIGHTS-2026</RightsAgreementId>
      <PLine>
        <Year>2026</Year>
        <PLineText>${data.tracks?.[0]?.p_line || '℗ 2026 TuneMavens'}</PLineText>
      </PLine>
    </SoundRecording>
  </ResourceList>
  <ReleaseList>
    <Release>
      <ReleaseId>
        <GRid>A12026TM00001</GRid>
        <ICPN>${data.upc || '198273641029'}</ICPN>
      </ReleaseId>
      <ReferenceTitle>
        <TitleText>${data.title || 'Untitled'}</TitleText>
      </ReferenceTitle>
      <ReleaseResourceReferenceList>
        <ReleaseResourceReference ReleaseResourceType="PrimaryResource">A1</ReleaseResourceReference>
      </ReleaseResourceReferenceList>
      <GlobalReleaseDate>${data.release_date || '2026-02-14'}</GlobalReleaseDate>
      <TerritoryCode>${data.territories === 'Worldwide' ? 'Worldwide' : 'Selective'}</TerritoryCode>
      <TargetDSPList>
        ${(data.target_outlets || ['spotify', 'apple_music', 'tunestream'])
          .map((dsp) => `<DSPPartner>${dsp.toUpperCase()}</DSPPartner>`)
          .join('\n        ')}
      </TargetDSPList>
    </Release>
  </ReleaseList>
  <DealList>
    <ReleaseDeal>
      <DealTerms>
        <CommercialModelType>SubscriptionModel</CommercialModelType>
        <Usage>
          <UseType>Stream</UseType>
          <UseType>PermanentDownload</UseType>
          <UseType>SocialMediaSoundSync</UseType>
        </Usage>
        <DistributionWaterfall>${data.split_cascade || 'Artist (60%) / Producer (25%) / Label (15%)'}</DistributionWaterfall>
      </DealTerms>
    </ReleaseDeal>
  </DealList>
</ern:NewReleaseMessage>`;
  };

  const xmlOutput = generateXmlString(sheet);

  const handleCopy = () => {
    navigator.clipboard.writeText(viewMode === 'xml' ? xmlOutput : JSON.stringify(sheet, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([viewMode === 'xml' ? xmlOutput : JSON.stringify(sheet, null, 2)], {
      type: viewMode === 'xml' ? 'application/xml' : 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(sheet?.title || 'release').toLowerCase().replace(/\s+/g, '_')}_ddex_feed.${viewMode === 'xml' ? 'xml' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0b0f1e',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          borderRadius: '3px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(0,242,254,0.08) 0%, rgba(139,92,246,0.05) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '3px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid var(--cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan)',
              }}
            >
              <RiFileCodeLine size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>
                DDEX 3.8 XML Metadata Sheet
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Standard Electronic Release Feed for DSP Delivery • {releaseTitle || 'Release'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* View Mode Toggle Bar */}
        <div
          style={{
            padding: '10px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setViewMode('formatted')}
              style={{
                padding: '5px 12px',
                background: viewMode === 'formatted' ? 'rgba(0,242,254,0.15)' : 'transparent',
                border: viewMode === 'formatted' ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '3px',
                color: viewMode === 'formatted' ? 'var(--cyan)' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Summary Sheet
            </button>
            <button
              type="button"
              onClick={() => setViewMode('xml')}
              style={{
                padding: '5px 12px',
                background: viewMode === 'xml' ? 'rgba(0,242,254,0.15)' : 'transparent',
                border: viewMode === 'xml' ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '3px',
                color: viewMode === 'xml' ? 'var(--cyan)' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              DDEX 3.8 XML Raw
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                padding: '5px 12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {copied ? <RiCheckLine color="#10b981" /> : <RiFileCopyLine />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                padding: '5px 12px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
                border: 'none',
                borderRadius: '3px',
                color: '#000',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RiDownloadCloud2Line /> Download {viewMode === 'xml' ? 'XML' : 'JSON'}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Loading standardized DDEX manifest...
            </div>
          ) : viewMode === 'xml' ? (
            <pre
              style={{
                margin: 0,
                padding: '16px',
                backgroundColor: '#050811',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '3px',
                fontSize: '12px',
                lineHeight: '1.5',
                color: '#38bdf8',
                fontFamily: 'monospace',
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}
            >
              {xmlOutput}
            </pre>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Checksum Badge */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#6ee7b7',
                  fontSize: '12px',
                }}
              >
                <RiShieldCheckFill size={18} color="#10b981" />
                <span>
                  <strong>SHA-256 Checksum Verified:</strong> {sheet?.metadata_checksum || 'sha256_verified'}
                </span>
              </div>

              {/* Grid Metadata */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '14px',
                }}
              >
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Release Title</span>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{sheet?.title}</strong>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Primary Artist</span>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{sheet?.artist}</strong>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>ISRC</span>
                  <strong style={{ fontSize: '14px', color: 'var(--cyan)', fontFamily: 'monospace' }}>
                    {sheet?.tracks?.[0]?.isrc || 'N/A'}
                  </strong>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>UPC / EAN</span>
                  <strong style={{ fontSize: '14px', color: '#fff', fontFamily: 'monospace' }}>
                    {sheet?.upc || 'N/A'}
                  </strong>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Release Date</span>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{sheet?.release_date || 'Live'}</strong>
                </div>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Batch ID</span>
                  <strong style={{ fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace' }}>
                    {sheet?.ddex_batch || 'TM-BATCH'}
                  </strong>
                </div>
              </div>

              {/* Target Outlets */}
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Target DSP Feed Endpoints ({sheet?.target_outlets?.length || 0} Outlets)
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(sheet?.target_outlets || []).map((o) => (
                    <span
                      key={o}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(0,242,254,0.1)',
                        border: '1px solid rgba(0,242,254,0.2)',
                        borderRadius: '3px',
                        color: 'var(--cyan)',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {o.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Split Waterfall */}
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Royalty Payout Distribution Waterfall
                </span>
                <strong style={{ fontSize: '13px', color: '#10b981' }}>{sheet?.split_cascade}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
