import React, { useState } from 'react';
import { 
  RiCompass3Line, RiListCheck, RiFolderMusicLine, RiBriefcaseLine, 
  RiUpload2Line, RiSparklingLine, RiGlobalLine, RiCheckDoubleLine, 
  RiSearchLine, RiSendPlaneFill, RiExchangeDollarLine, RiTimerLine
} from 'react-icons/ri';
import './App.css';

const SAMPLE_BRIEFS = [
  { id: 1, project: "Untitled Cyberpunk Drama", client: "Netflix Series", budget: "$15,000", duration: "Full Sync", status: "Active", genre: "Synthwave / Dark Techno", deadline: "3 days left" },
  { id: 2, project: "Summer Adventure Campaign", client: "Automotive TV Commercial", budget: "$45,000", duration: "30s Edit", status: "Active", genre: "Indie Pop / Uplifting", deadline: "5 days left" },
  { id: 3, project: "Ethereal Indie Film", client: "A24 Feature", budget: "$8,500", duration: "End Credits", status: "Closed", genre: "Neo-Classical / Dream Pop", deadline: "Closed" },
  { id: 4, project: "Sports Energy Promo", client: "EA Sports Trax", budget: "$25,000", duration: "In-Game Loop", status: "Active", genre: "Phonk / Heavy Beats", deadline: "24 hours left" },
];

export default function App() {
  const [briefs, setBriefs] = useState(SAMPLE_BRIEFS);
  const [selectedBrief, setSelectedBrief] = useState(SAMPLE_BRIEFS[0]);
  const [pitchInput, setPitchInput] = useState('');
  const [submittedPitches, setSubmittedPitches] = useState({});

  const handlePitchSubmit = (e) => {
    e.preventDefault();
    if (!pitchInput.trim()) return;
    setSubmittedPitches({
      ...submittedPitches,
      [selectedBrief.id]: pitchInput
    });
    setPitchInput('');
  };

  return (
    <div className="sm-container">
      {/* Domain Alert Banner */}
      <div className="sm-domain-banner">
        <RiGlobalLine className="banner-icon" />
        <span>Deploying Utility Automatically to: <strong>syncmavens.com</strong> (formerly SyncMaster)</span>
      </div>

      <div className="sm-main-layout">
        {/* Sidebar */}
        <aside className="sm-sidebar">
          <div className="sm-logo">
            <RiSparklingLine className="logo-icon" />
            <h2>SYNC<span>MAVENS</span></h2>
          </div>
          <nav className="sm-nav">
            <span className="nav-section-title">Operations</span>
            <a href="#briefs" className="nav-item active">
              <RiBriefcaseLine /> Active Briefs
            </a>
            <a href="#catalog" className="nav-item">
              <RiFolderMusicLine /> My Catalog
            </a>
            
            <span className="nav-section-title">Transactions</span>
            <a href="#pitches" className="nav-item">
              <RiListCheck /> My Pitches
            </a>
            <a href="#royalties" className="nav-item">
              <RiExchangeDollarLine /> Deal Ledger
            </a>
          </nav>
          
          <div className="sm-brand-meta">
            <div className="meta-card">
              <span>Sync License Status</span>
              <strong>Active Pipeline</strong>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="sm-content">
          <header className="sm-header">
            <div className="search-bar">
              <RiSearchLine />
              <input type="text" placeholder="Search film briefs, supervisors, projects..." />
            </div>
            <button className="btn-upload">
              <RiUpload2Line /> Ingest Catalog
            </button>
          </header>

          {/* Grid Layout: Briefs List & Detail Panel */}
          <div className="sm-workspace">
            <section className="briefs-section">
              <div className="workspace-title">
                <h3>Incoming Licensing Briefs</h3>
              </div>
              <div className="briefs-grid">
                {briefs.map((brief) => (
                  <div 
                    key={brief.id} 
                    className={`brief-card ${selectedBrief.id === brief.id ? 'active' : ''}`}
                    onClick={() => setSelectedBrief(brief)}
                  >
                    <div className="brief-header">
                      <span className="brief-client">{brief.client}</span>
                      <span className={`brief-badge ${brief.status.toLowerCase()}`}>{brief.status}</span>
                    </div>
                    <h4>{brief.project}</h4>
                    <div className="brief-footer">
                      <div className="brief-metric">
                        <span className="metric-label">Budget</span>
                        <span className="metric-value">{brief.budget}</span>
                      </div>
                      <div className="brief-metric">
                        <span className="metric-label">Genre</span>
                        <span className="metric-value">{brief.genre}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Interactive Pitch Panel */}
            <aside className="pitch-panel">
              <div className="panel-inner">
                <h3>Submit Pitch Proposal</h3>
                <div className="brief-detail-meta">
                  <div className="detail-row">
                    <span className="detail-label">Project</span>
                    <strong className="detail-value">{selectedBrief.project}</strong>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Budget Limit</span>
                    <strong className="detail-value text-accent">{selectedBrief.budget}</strong>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Placement Time</span>
                    <strong className="detail-value">{selectedBrief.duration}</strong>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Required Style</span>
                    <strong className="detail-value">{selectedBrief.genre}</strong>
                  </div>
                </div>

                {submittedPitches[selectedBrief.id] ? (
                  <div className="pitch-success">
                    <RiCheckDoubleLine className="success-icon" />
                    <h4>Pitch Submitted Successfully!</h4>
                    <p>"{submittedPitches[selectedBrief.id]}"</p>
                    <span className="pitch-time"><RiTimerLine /> Pending supervisor review</span>
                  </div>
                ) : selectedBrief.status === 'Closed' ? (
                  <div className="pitch-closed">
                    <p>This licensing brief is closed and no longer accepting submissions.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePitchSubmit} className="pitch-form">
                    <label>Select Track / Enter Metadata</label>
                    <textarea 
                      placeholder="e.g. Track #24 - Midnight Sun. Rationale: Matches the dark driving vibe requested in section 2..."
                      value={pitchInput}
                      onChange={(e) => setPitchInput(e.target.value)}
                    />
                    <button type="submit" className="btn-submit-pitch">
                      <RiSendPlaneFill /> Submit Pitch to Supervisor
                    </button>
                  </form>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
