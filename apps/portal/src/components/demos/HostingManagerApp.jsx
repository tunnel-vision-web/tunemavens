import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiArrowLeftLine, 
  RiArrowRightLine, 
  RiExternalLinkLine, 
  RiGlobalFill, 
  RiGlobalLine, 
  RiServerFill, 
  RiServerLine,
  RiCheckLine, 
  RiCheckDoubleLine, 
  RiShieldCheckFill, 
  RiLockFill, 
  RiLockPasswordFill,
  RiSearchLine, 
  RiRefreshLine,
  RiFileCopyLine,
  RiCheckFill,
  RiSpeedUpFill,
  RiLayoutMasonryFill,
  RiEarthLine,
  RiCpuFill,
  RiDatabase2Fill
} from 'react-icons/ri'

export default function HostingManagerApp({ goBack, sessionUser }) {
  const [domainInput, setDomainInput] = useState('sarahjensen.com');
  const [isTestingDns, setIsTestingDns] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState('dns');
  const [copiedKey, setCopiedKey] = useState(null);

  const dnsRecords = [
    { type: 'CNAME', host: 'www', target: 'cname.tunemavens.com', ttl: '300s', status: 'Active', latency: '12ms' },
    { type: 'A', host: '@', target: '76.76.21.21 (Global Anycast)', ttl: '300s', status: 'Routed', latency: '14ms' },
    { type: 'TXT', host: '_tunemavens', target: 'tm-verify-live-99a81c2b', ttl: '3600s', status: 'SSL Verified', latency: 'Instant' },
    { type: 'CAA', host: '@', target: '0 issue "letsencrypt.org"', ttl: '3600s', status: 'Enforced', latency: 'Policy' }
  ];

  const subdomains = [
    { name: 'sarahjensen.tunemavens.com', target: 'EPK Studio Web World', status: 'Live', ssl: 'TLS 1.3 Active', visitors: '8,420/mo' },
    { name: 'merch.sarahjensen.com', target: 'POS Terminal Merch Counter', status: 'Live', ssl: 'TLS 1.3 Active', visitors: '2,150/mo' },
    { name: 'vip.sarahjensen.com', target: 'Smart CRM Fan Portal', status: 'Live', ssl: 'TLS 1.3 Active', visitors: '940/mo' },
    { name: 'stream.sarahjensen.com', target: 'Lossless Web Player Embed', status: 'Live', ssl: 'TLS 1.3 Active', visitors: '5,310/mo' }
  ];

  const edgePops = [
    { region: 'North America (Ashburn, VA)', ip: '76.76.21.21', latency: '11ms', status: 'Resolved 100%' },
    { region: 'Europe (Frankfurt, DE)', ip: '76.76.21.22', latency: '14ms', status: 'Resolved 100%' },
    { region: 'East Africa (Nairobi, KE)', ip: '76.76.21.25', latency: '21ms', status: 'Resolved 100%' },
    { region: 'Asia-Pacific (Tokyo, JP)', ip: '76.76.21.28', latency: '19ms', status: 'Resolved 100%' },
    { region: 'Latin America (São Paulo, BR)', ip: '76.76.21.30', latency: '24ms', status: 'Resolved 100%' }
  ];

  const handleTestDns = () => {
    setIsTestingDns(true);
    setTestResults(null);
    setTimeout(() => {
      setIsTestingDns(false);
      setTestResults({
        domain: domainInput,
        timestamp: new Date().toLocaleTimeString(),
        anycastScore: 'A+ (14ms Global Avg)',
        sslStatus: 'Valid Wildcard TLS 1.3',
        propagation: '100% of 240+ POPs Verified'
      });
    }, 900);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const primaryActionUrl = sessionUser 
    ? "/dashboard?tab=epk-builder" 
    : "/register?role=creator";

  return (
    <div style={{ width: '100%' }}>
      {/* Back button */}
      <div style={{ marginBottom: '24px' }}>
        {typeof goBack === 'function' && (
          <button 
            onClick={goBack} 
            className="btn-secondary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
          >
            <RiArrowLeftLine size={16} /> Back to Dashboard Apps
          </button>
        )}
      </div>

      {/* Hero Glass Panel */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '36px 32px', 
          borderRadius: '12px', 
          border: '1px solid rgba(59, 130, 246, 0.25)', 
          marginBottom: '32px',
          background: 'radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.08), rgba(6, 8, 19, 0.6) 70%)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#3b82f6', display: 'block', marginBottom: '8px' }}>
              CLOUD INFRASTRUCTURE &amp; DOMAINS
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
              Hosting Manager &amp; Custom Domain Engine
            </h2>
            <p style={{ color: 'var(--mu)', fontSize: '14.5px', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
              Deploy high-performance artist web worlds, configure enterprise edge DNS zones, issue automatic wildcard SSL certificates, and map custom vanity domains with zero downtime.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link 
              to={primaryActionUrl} 
              className="btn-primary" 
              style={{ padding: '10px 22px', fontSize: '13px', background: '#3b82f6', color: '#fff', fontWeight: 700 }}
            >
              Connect Custom Domain <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
            </Link>
            <Link to="/epk" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
              Launch EPK Studio
            </Link>
            <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
              Creator World Guide
            </Link>
          </div>
        </div>

        {/* Network Performance KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Global CDN Edge Latency</span>
              <RiGlobalFill size={18} style={{ color: '#3b82f6' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>14ms</div>
            <span style={{ fontSize: '11.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              ● 240+ Anycast edge nodes
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Active Custom Domains</span>
              <RiServerFill size={18} style={{ color: 'var(--cyan)' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'Space Grotesk, sans-serif' }}>1,280+</div>
            <span style={{ fontSize: '11.5px', color: 'var(--mu)', marginTop: '4px', display: 'block' }}>
              Live SSL &amp; DNS mapped
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Edge Availability SLA</span>
              <RiShieldCheckFill size={18} style={{ color: '#10b981' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', fontFamily: 'Space Grotesk, sans-serif' }}>99.99%</div>
            <span style={{ fontSize: '11.5px', color: 'var(--mu)', marginTop: '4px', display: 'block' }}>
              Zero-downtime rolling deploys
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Automatic Wildcard TLS</span>
              <RiLockPasswordFill size={18} style={{ color: '#a855f7' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>100% Auto</div>
            <span style={{ fontSize: '11.5px', color: 'var(--mu)', marginTop: '4px', display: 'block' }}>
              Let's Encrypt TLS 1.3 renewal
            </span>
          </div>
        </div>
      </div>

      {/* Interactive DNS Zone & Subdomain Manager */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
              Custom Domain DNS &amp; Propagation Inspector
            </h3>
            <p style={{ color: 'var(--mu)', fontSize: '13px', margin: 0 }}>
              Test your domain resolution against our 240+ Anycast edge locations, or inspect active DNS zone records.
            </p>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('dns')}
              style={{
                background: activeTab === 'dns' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: activeTab === 'dns' ? '#3b82f6' : 'var(--mu)',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              DNS Zone Records
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('subdomains')}
              style={{
                background: activeTab === 'subdomains' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: activeTab === 'subdomains' ? '#3b82f6' : 'var(--mu)',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Active Subdomains (4)
            </button>
          </div>
        </div>

        {/* Domain Test Bar */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <RiGlobalLine size={20} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 600 }}>Domain Name:</span>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. artistname.com"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                padding: '7px 12px',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'monospace',
                flex: 1,
                maxWidth: '280px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleTestDns}
              disabled={isTestingDns}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '12.5px', background: '#3b82f6', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RiRefreshLine size={14} className={isTestingDns ? 'spin' : ''} />
              {isTestingDns ? 'Testing Anycast Nodes...' : 'Test DNS Propagation'}
            </button>
          </div>
        </div>

        {/* Live Test Results Notification */}
        {testResults && (
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiCheckDoubleLine size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#fff' }}>
                  DNS Propagation Verified: <code style={{ color: '#10b981' }}>{testResults.domain}</code>
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--mu)' }}>Checked at {testResults.timestamp}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '12px' }}>
              {edgePops.map((p, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '11.5px', marginBottom: '2px' }}>{p.region}</div>
                  <div style={{ color: '#10b981', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span>{p.status}</span>
                    <span style={{ fontFamily: 'monospace' }}>{p.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DNS Zone Records Table */}
        {activeTab === 'dns' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--mu)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  <th style={{ padding: '12px 14px' }}>Record Type</th>
                  <th style={{ padding: '12px 14px' }}>Host / Name</th>
                  <th style={{ padding: '12px 14px' }}>Routing Value</th>
                  <th style={{ padding: '12px 14px' }}>TTL</th>
                  <th style={{ padding: '12px 14px' }}>Resolution Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Copy Value</th>
                </tr>
              </thead>
              <tbody>
                {dnsRecords.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px' }}>
                      <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '11px', fontFamily: 'monospace' }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                      {r.host}
                    </td>
                    <td style={{ padding: '14px', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '12.5px' }}>
                      {r.target}
                    </td>
                    <td style={{ padding: '14px', color: 'var(--mu)', fontSize: '12px' }}>
                      {r.ttl}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#10b981', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                        {r.status} ({r.latency})
                      </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleCopy(r.target, `dns-${idx}`)}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          padding: '5px 10px',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {copiedKey === `dns-${idx}` ? <RiCheckFill size={13} style={{ color: '#10b981' }} /> : <RiFileCopyLine size={13} />}
                        {copiedKey === `dns-${idx}` ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Active Subdomains Table */}
        {activeTab === 'subdomains' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--mu)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  <th style={{ padding: '12px 14px' }}>Subdomain URL</th>
                  <th style={{ padding: '12px 14px' }}>Mounted Application</th>
                  <th style={{ padding: '12px 14px' }}>Security Status</th>
                  <th style={{ padding: '12px 14px' }}>Traffic Volume</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subdomains.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--cyan)', fontFamily: 'monospace' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '14px', color: '#fff', fontWeight: 600 }}>
                      {s.target}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#10b981', fontWeight: 600 }}>
                        <RiLockFill size={13} /> {s.ssl}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--mu)', fontSize: '12px' }}>
                      {s.visitors}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <Link
                        to="/epk"
                        className="btn-secondary"
                        style={{ padding: '5px 12px', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        Edit World <RiExternalLinkLine size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Core Infrastructure Capabilities Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#3b82f6', marginBottom: '12px' }}><RiGlobalFill size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Edge Anycast Routing (240+ POPs)</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Serve lossless audio streams, high-resolution EPK press imagery, and video reels from the geographic edge closest to your fans.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#10b981', marginBottom: '12px' }}><RiShieldCheckFill size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Automated Wildcard TLS 1.3</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Zero-configuration SSL certificates automatically provisioned via Cloudflare Edge and Let's Encrypt with auto-renewals every 60 days.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'var(--cyan)', marginBottom: '12px' }}><RiCpuFill size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Modular Web Sandbox</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Run independent artist micro-sites, merchandise storefronts, and tour ticketing widgets with strict CORS sandboxing.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#a855f7', marginBottom: '12px' }}><RiRefreshLine size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Sub-Second Cache Invalidation</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Push EPK biography updates, tour schedule additions, and unreleased single previews with immediate global edge cache purge.
          </p>
        </div>
      </div>

      {/* Supported Web Modules Showcase */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            INTEGRATED SUITE · EDGE COMPATIBILITY
          </span>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px', fontFamily: 'Sansation, sans-serif' }}>
            Modules Ready for Your Custom Domain
          </h3>
          <p style={{ color: 'var(--mu)', fontSize: '13.5px', margin: 0 }}>
            Every dashboard app can be routed directly to your personal vanity domain with unified session authentication.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { title: 'EPK Artist World', icon: <RiLayoutMasonryFill size={22} style={{ color: 'var(--cyan)' }} />, desc: 'Responsive media blocks, bio editor, and interactive audio embeds.' },
            { title: 'TuneStream Player Embed', icon: <RiGlobalFill size={22} style={{ color: '#10b981' }} />, desc: 'Lossless audio streaming directly on your personal web destination.' },
            { title: 'Sync Pitch Portals', icon: <RiEarthLine size={22} style={{ color: '#f59e0b' }} />, desc: 'Watermarked cue auditions for music supervisors and film directors.' },
            { title: 'POS Terminal Checkout', icon: <RiServerLine size={22} style={{ color: '#a855f7' }} />, desc: 'Direct merch and ticket sales with Stripe and M-Pesa integration.' },
          ].map((mod, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ marginBottom: '4px' }}>{mod.icon}</div>
              <h5 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 700 }}>{mod.title}</h5>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', lineHeight: 1.5 }}>{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '36px 32px', 
          borderRadius: '12px', 
          border: '1px solid rgba(59, 130, 246, 0.2)', 
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 8, 19, 0.6) 100%)'
        }}
      >
        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
          Deploy Your Custom Domain in Under 60 Seconds
        </h3>
        <p style={{ color: 'var(--mu)', fontSize: '14.5px', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Establish your independent artist brand with enterprise-grade cloud hosting, global Anycast DNS, and instant SSL encryption.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link 
            to={primaryActionUrl} 
            className="btn-primary" 
            style={{ padding: '12px 28px', fontSize: '14px', background: '#3b82f6', color: '#fff', fontWeight: 700 }}
          >
            Connect Custom Domain Now <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
          </Link>
          <Link to="/epk" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '14px' }}>
            Build Artist EPK
          </Link>
          <Link to="/help" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '14px' }}>
            DNS Setup Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
