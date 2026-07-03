      </div>

      {/* === PERFECT FOR SIDEBAR SPLIT (content area below hero only) === */}
      <div 
        className="landing-content-split" 
        style={{ 
          display: 'flex', 
          gap: '32px', 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '40px 24px',
          alignItems: 'flex-start'
        }}
      >
        {/* LEFT: 1/4 width - Continuous upward scrolling Perfect For sidebar */}
        <div style={{ flex: '0 0 25%', minWidth: '280px' }}>
          <PerfectForSidebar />
        </div>

        {/* RIGHT: 3/4 width - All original content sections unchanged */}
        <div style={{ flex: 1 }}>
          {/* Flagship previews, UserPersonaCarousel, pain points, architecture, CTA banner, etc. */}
