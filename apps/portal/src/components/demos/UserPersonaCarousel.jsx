import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import userSongwriterImg from '../../assets/images/user_songwriter.png'
import userSupervisorImg from '../../assets/images/user_supervisor.png'
import userManagerImg from '../../assets/images/user_manager.png'
import userProducerImg from '../../assets/images/user_producer.png'

export default function UserPersonaCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slides = [
    {
      title: "Drowning in Publishing Split Sheet Cuts?",
      subtitle: "Keep 100% of your licensing revenues. TuneMavens AI matches, pitches, and delivers audio catalogs directly to game developers and film music supervisors without a middleman.",
      persona: "Independent Songwriter",
      image: userSongwriterImg,
      cta: "Start Free Pitching",
      link: "/register",
      painpoint: "Publishing Middlemen take 50% of revenue",
      solution: "Self-Publish & Pitch directly with Sync Brief AI"
    },
    {
      title: "Struggling to Find Pre-Cleared Music Content?",
      subtitle: "Search and license high-fidelity tracks instantly. TuneMavens connects you directly to self-published songwriters with pre-cleared, AI-tagged audio assets ready for synchronization.",
      persona: "Music Supervisor",
      image: userSupervisorImg,
      cta: "Browse Pre-Cleared Music",
      link: "/tools",
      painpoint: "Unclear split rights and untagged catalogs stall clearances",
      solution: "Instant search of verified, 100% pre-cleared sync tags"
    },
    {
      title: "Losing Catalog Margins on Inefficient Royalty Tools?",
      subtitle: "Automate splits and catalog accounting in seconds. Our Split Cascade Ledger is built for modern record labels to ingest distributor statement CSV files, calculate cascading shares, and pay roster artists seamlessly.",
      persona: "Record Label Executive",
      image: userManagerImg,
      cta: "Start Seamless Operations",
      link: "/register",
      painpoint: "Manual spreadsheets cause payout errors and ingestion delays",
      solution: "Seamless CSV ledger ingestion and instant roster payouts"
    },
    {
      title: "Paying $150 per Track Just for Mastering?",
      subtitle: "Run unlimited mastering passes on our unified credits pool. Match loudness parameters (LUFS) for Apple Music and Spotify instantly without hiring studio engineers.",
      persona: "DIY Recording Artist",
      image: userProducerImg,
      cta: "Start Free Mastering",
      link: "/register",
      painpoint: "High studio engineering costs per track",
      solution: "Unlimited reference mastering runs in seconds"
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  const current = slides[activeSlide];

  return (
    <section className="section-wrapper persona-carousel-section">
      <div className="section-header text-center">
        <span className="section-label">Target Audience Solutions</span>
        <h2 className="section-title">Who is TuneMavens Built For?</h2>
        <p className="section-desc">
          Compare your current music business roadblocks with our direct operational solutions built for your specific role.
        </p>
      </div>

      <div 
        className="persona-carousel glass-panel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="persona-carousel-content">
          <div className="persona-carousel-image-container">
            <img src={current.image} alt={current.persona} className="persona-carousel-image" />
          </div>
          <div className="persona-carousel-info">
            <span className="persona-badge">{current.persona}</span>
            <h3 className="persona-title">{current.title}</h3>
            <p className="persona-text">{current.subtitle}</p>
            
            <div className="persona-comparison">
              <div className="comparison-item pain">
                <strong>Roadblock:</strong> {current.painpoint}
              </div>
              <div className="comparison-item solution">
                <strong>TuneMavens Fix:</strong> {current.solution}
              </div>
            </div>

            <Link to={current.link} className="btn-primary" style={{ padding: '12px 28px', display: 'inline-flex', alignSelf: 'flex-start', marginTop: '16px' }}>
              {current.cta}
            </Link>
          </div>
        </div>

        <div className="persona-dots">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              type="button"
              className={`persona-dot ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
