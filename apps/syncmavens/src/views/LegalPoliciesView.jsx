import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  RiShieldCheckFill, 
  RiFileTextFill, 
  RiCookieFill, 
  RiRefund2Fill, 
  RiPrinterLine, 
  RiLinksLine, 
  RiCheckLine, 
  RiMailSendFill, 
  RiCustomerService2Fill,
  RiInformationFill
} from 'react-icons/ri';
import { LEGAL_POLICIES } from '../data/legalPolicies.js';
import './LegalPoliciesView.css';

// Markdown text parser into structured JSX
function PolicyTextRenderer({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  let inList = false;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`}>
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const formatInline = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={`h3-${i}`}>{trimmed.replace('### ', '')}</h3>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(trimmed.substring(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      flushList();
      elements.push(
        <p key={`p-num-${i}`} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    } else {
      flushList();
      elements.push(
        <p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList();
  return <div className="legal-section-body">{elements}</div>;
}

export default function LegalPoliciesView({ defaultPolicy = 'privacy' }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getPolicyFromPath = (path) => {
    if (path.includes('terms')) return 'terms';
    if (path.includes('cookie')) return 'cookies';
    if (path.includes('refund')) return 'refund';
    if (path.includes('privacy')) return 'privacy';
    return defaultPolicy;
  };

  const [activePolicyKey, setActivePolicyKey] = useState(() => getPolicyFromPath(location.pathname));
  const [activeSectionId, setActiveSectionId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const policyFromPath = getPolicyFromPath(location.pathname);
    setActivePolicyKey(policyFromPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const activePolicy = LEGAL_POLICIES[activePolicyKey] || LEGAL_POLICIES.privacy;

  const handleTabChange = (key) => {
    setActivePolicyKey(key);
    let targetPath = '/privacy';
    if (key === 'terms') targetPath = '/terms';
    if (key === 'cookies') targetPath = '/cookies';
    if (key === 'refund') targetPath = '/refund';
    navigate(targetPath);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const policyIcons = {
    privacy: <RiShieldCheckFill size={16} />,
    terms: <RiFileTextFill size={16} />,
    cookies: <RiCookieFill size={16} />,
    refund: <RiRefund2Fill size={16} />
  };

  return (
    <div className="legal-page-container">
      {/* Header Banner */}
      <header className="legal-header">
        <div className="legal-header-top">
          <div>
            <span className="legal-header-badge">
              <RiShieldCheckFill size={13} /> {activePolicy.badge}
            </span>
            <h1 className="legal-title">{activePolicy.title}</h1>
            <p className="legal-subtitle">{activePolicy.summary}</p>
          </div>
          <div className="legal-actions">
            <button 
              type="button" 
              className={`legal-action-btn ${copiedLink ? 'copied' : ''}`}
              onClick={handleCopyLink}
              title="Copy shareable link"
            >
              {copiedLink ? <RiCheckLine size={15} /> : <RiLinksLine size={15} />}
              {copiedLink ? 'Link Copied' : 'Share Link'}
            </button>
            <button 
              type="button" 
              className="legal-action-btn"
              onClick={handlePrint}
              title="Print policy"
            >
              <RiPrinterLine size={15} /> Print / PDF
            </button>
          </div>
        </div>

        {/* Policy Switcher Tabs */}
        <div className="legal-tabs" role="tablist">
          {Object.entries(LEGAL_POLICIES).map(([key, policy]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activePolicyKey === key}
              className={`legal-tab-btn ${activePolicyKey === key ? 'active' : ''}`}
              onClick={() => handleTabChange(key)}
            >
              {policyIcons[key]}
              {policy.title}
            </button>
          ))}
        </div>
      </header>

      {/* In Plain English Summary Callout */}
      <aside className="plain-english-box" aria-label="Plain English Summary">
        <div className="plain-english-header">
          <RiInformationFill size={18} /> In Plain English
        </div>
        <p className="plain-english-desc">{activePolicy.plainEnglishSummary}</p>
      </aside>

      {/* Main Two-Column Layout */}
      <div className="legal-layout">
        {/* Left Table of Contents */}
        <aside className="legal-sidebar">
          <h2 className="legal-toc-title">Table of Contents</h2>
          <ul className="legal-toc-list">
            {activePolicy.sections.map((section) => (
              <li key={section.id}>
                <a 
                  href={`#${section.id}`} 
                  className={`legal-toc-link ${activeSectionId === section.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSectionId(section.id);
                    const el = document.getElementById(section.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>

          <div className="legal-sidebar-meta">
            <div><strong>Effective Date:</strong> {activePolicy.effectiveDate}</div>
            <div><strong>Last Updated:</strong> {activePolicy.lastUpdated}</div>
            <div style={{ marginTop: '8px' }}>Dual Jurisdiction: Nairobi, Kenya &amp; Delaware, USA</div>
          </div>
        </aside>

        {/* Right Content Sections */}
        <main className="legal-content">
          {activePolicy.sections.map((section) => (
            <section 
              key={section.id} 
              id={section.id} 
              className="legal-section-card"
            >
              <h2 className="legal-section-title">{section.title}</h2>
              
              {section.inPlainEnglish && (
                <div className="section-plain-english">
                  <div className="section-plain-english-label">Quick Take:</div>
                  <p className="section-plain-english-text">{section.inPlainEnglish}</p>
                </div>
              )}

              <PolicyTextRenderer text={section.content} />
            </section>
          ))}

          {/* Bottom Compliance & Contact Card */}
          <div className="legal-footer-card">
            <div className="legal-footer-text">
              <h4>Questions About Synchronization Rights or Compliance?</h4>
              <p>
                Our sync legal and data protection team is available to assist you with inquiries, 
                rights clearance, cue sheets, and privacy rights requests.
              </p>
            </div>
            <div className="legal-footer-links">
              <a 
                href="mailto:privacy@intermaven.io" 
                className="legal-footer-btn"
              >
                <RiMailSendFill size={15} /> Email DPO
              </a>
              <Link 
                to="/faq" 
                className="legal-footer-btn secondary"
              >
                <RiCustomerService2Fill size={15} /> Sync FAQ &amp; Support
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
