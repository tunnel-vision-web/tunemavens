import React from 'react'
import { Link } from 'react-router-dom'
import { RiCalendarEventFill, RiMapPinRangeLine, RiMoneyDollarCircleLine, RiCheckboxCircleLine, RiSendPlaneFill } from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'
import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'
import tourDashboardMockup from '../../assets/images/tour_dashboard_mockup.png'
import SEO from '../../components/common/SEO.jsx'

export default function ToursView({ sessionUser }) {
  const ctaLink = sessionUser ? '/dashboard?tab=pos-settlement' : '/register';

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TuneMavens Tours & Live Bookings",
    "description": "Coordinate live concert gigs, manage merchandise inventory, and handle automated financial settlements for your tour roster.",
    "provider": {
      "@type": "Organization",
      "name": "TuneMavens"
    }
  };

  return (
    <>
      <SEO 
        title="Tours & Live Bookings" 
        description="Coordinate live concert gigs, manage merchandise inventory, and handle automated financial settlements for your tour roster."
        schema={schema}
      />
      <PageHeader 
        title="Tours & Live Bookings" 
        bgImage={headerAppsImg} 
        bgImageWestern={headerAppsWesternImg} 
        breadcrumb="Tours coordination" 
      />
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '50px' }}>
        {/* Intro Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '70px' }}>
          <div>
            <span style={{ color: 'var(--purple)', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Roster & Venue Management
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
              Plan, Coordinate, and Settle Your Live Gigs
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
              Coordinating a multi-city tour requires syncing schedules, tickets, merch inventory, and local settlements. 
              TuneMavens Tours provides an all-in-one organizer tool that keeps your crew, promoters, and accountant on the same page.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--purple)' }} size={18} />
                <span>Multi-stop schedule route planner & mapping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--purple)' }} size={18} />
                <span>Box office ticket scanning and real-time gate metrics</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <RiCheckboxCircleLine style={{ color: 'var(--purple)' }} size={18} />
                <span>Immediate live disburse to crew and artists splits</span>
              </div>
            </div>
            <Link 
              to={ctaLink} 
              className="btn-primary" 
              style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', background: 'var(--purple)', border: '1px solid var(--purple)' }}
            >
              Start Planning Your Tour
            </Link>
          </div>

          {/* Tour Mockup Image */}
          <div className="glass-panel" style={{ padding: '8px', borderRadius: '8px', overflow: 'hidden' }}>
            <img 
              src={tourDashboardMockup} 
              alt="TuneMavens Tour Dashboard Console" 
              style={{ width: '100%', borderRadius: '4px', display: 'block' }} 
            />
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '40px' }}>
            Designed for Live Concert Operations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px 24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', color: 'var(--purple)', borderRadius: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <RiCalendarEventFill size={20} />
              </div>
              <h4 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>Event Ticketing Integration</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                Generate QR-code tickets for your stops, monitor capacity caps, and scan arrivals at the door with our secure POS terminal system.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '32px 24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', color: 'var(--purple)', borderRadius: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <RiMapPinRangeLine size={20} />
              </div>
              <h4 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>Route Optimization</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                Plot tour dates, manage promoter deposits, and coordinate venue capacities in a unified calendar.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '32px 24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', color: 'var(--purple)', borderRadius: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <RiMoneyDollarCircleLine size={20} />
              </div>
              <h4 style={{ fontSize: '18px', color: '#fff', marginBottom: '12px' }}>Instant disburse</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                At the end of the show, disburse settlements from ticket sales, merch, and promoter advances immediately to all roster splits.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '40px', 
            borderRadius: '6px', 
            textAlign: 'center', 
            background: 'radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.06) 0%, transparent 70%)', 
            border: '1px solid rgba(139, 92, 246, 0.2)' 
          }}
        >
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            Coordinate your next live gig with TuneMavens
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '14px', maxWidth: '600px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            Unlock automated splits, inventory trackers, and on-site ticketing scanners by registering your tour profile.
          </p>
          <Link 
            to={ctaLink} 
            className="btn-primary" 
            style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', background: 'var(--purple)', border: '1px solid var(--purple)' }}
          >
            Create Tour Profile
          </Link>
        </div>
      </div>
    </>
  );
}
