import React, { useState } from 'react'
import { RiArrowDownSFill } from 'react-icons/ri'

export default function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`landing-faq-item ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="landing-faq-q"
        onClick={() => setOpen(o => !o)}
        data-testid="landing-faq-toggle"
      >
        <span>{q}</span>
        <RiArrowDownSFill size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>
      {open && <p className="landing-faq-a">{a}</p>}
    </div>
  );
}
