import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRegion } from '../../RegionContext.jsx'
import userSongwriterImg from '../../assets/images/user_songwriter.png'
import userSupervisorImg from '../../assets/images/user_supervisor.png'
import userManagerImg from '../../assets/images/user_manager.png'
import userProducerImg from '../../assets/images/user_producer.png'
import userProducerWesternImg from '../../assets/images/user_producer_western.png'

export default function UserPersonaCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { country } = useRegion();
  const isWestern = ['US', 'GB'].includes(country);

  const slides = [
    {
      title: "Tired of losing big cuts on your songwriting?",
      subtitle: "Keep what your music earns. Connect directly with film, television, and game creators looking for authentic songs, without middlemen taking half your profits.",
      persona: "Independent Songwriter",
      image: userSongwriterImg,
      cta: "Explore Creator Tools",
      link: "/for/creator",
      painpoint: "Traditional publishers often take up to 50% of your earnings",
      solution: "Self-publish and pitch directly with simple, clear tags"
    },
    {
      title: "Need quality music that is ready to license?",
      subtitle: "Discover songs from independent creators with 100% pre-cleared rights. Find the exact mood and genre for your project without clearance delays.",
      persona: "Music Supervisor",
      image: userSupervisorImg,
      cta: "Explore Supervisor Hub",
      link: "/for/supervisor",
      painpoint: "Unclear ownership and messy split rights slow down production",
      solution: "Instant access to pre-cleared, verified song catalogs"
    },
    {
      title: "Spending hours sorting out artist royalties?",
      subtitle: "Calculate splits and pay your roster in minutes. Upload distributor statement files, let our system divide shares automatically, and pay artists on time.",
      persona: "Record Label & Management",
      image: userManagerImg,
      cta: "Explore Label Console",
      link: "/for/label",
      painpoint: "Manual spreadsheets lead to calculation errors and delays",
      solution: "Upload distributor reports for automatic, error-free payouts"
    },
    {
      title: "Tired of expensive studio mastering fees?",
      subtitle: "Give your tracks professional streaming polish in seconds. Match the exact loudness standards for Spotify and Apple Music easily and affordably.",
      persona: "DIY Recording Artist & Producer",
      image: isWestern ? userProducerWesternImg : userProducerImg,
      cta: "Explore Producer Tools",
      link: "/for/creator",
      painpoint: "High studio engineering costs for every new single",
      solution: "Fast, studio-grade audio mastering at a fraction of the cost"
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
        <span className="section-label">Tailored Solutions</span>
        <h2 className="section-title">Who is TuneMavens Built For?</h2>
        <p className="section-desc">
          Compare your day-to-day music roadblocks with straightforward tools built for your specific role.
        </p>
      </div>

      <div 
        className="persona-carousel glass-panel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ borderRadius: '3px' }}
      >
        <div className="persona-carousel-content">
          <div className="persona-carousel-image-container" style={{ borderRadius: '3px' }}>
            <img src={current.image} alt={current.persona} className="persona-carousel-image" style={{ borderRadius: '3px' }} />
          </div>
          <div className="persona-carousel-info">
            <span className="persona-badge" style={{ borderRadius: '3px' }}>{current.persona}</span>
            <h3 className="persona-title">{current.title}</h3>
            <p className="persona-text">{current.subtitle}</p>
            
            <div className="persona-comparison" style={{ borderRadius: '3px' }}>
              <div className="comparison-item pain">
                <strong>Roadblock:</strong> {current.painpoint}
              </div>
              <div className="comparison-item solution">
                <strong>TuneMavens Fix:</strong> {current.solution}
              </div>
            </div>

            <Link to={current.link} className="btn-primary" style={{ padding: '12px 28px', display: 'inline-flex', alignSelf: 'flex-start', marginTop: '16px', borderRadius: '3px' }}>
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
