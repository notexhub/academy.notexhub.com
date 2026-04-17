'use client';
import { useState } from 'react';

export default function SyllabusAccordion({ modules = [] }) {
  const [open, setOpen] = useState(0);
  if (!modules.length) return <p style={{ color: 'var(--gray-400)', padding: '2rem', textAlign: 'center' }}>কোনো মডিউল পাওয়া যায়নি।</p>;
  return (
    <div className="accordion">
      {modules.map((m, i) => (
        <div key={i} className="accordion-item">
          <button className={`accordion-header ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: open === i ? 'var(--lime)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 700, color: open === i ? 'var(--navy)' : 'var(--gray-500)', flexShrink: 0, transition: 'var(--transition)' }}>{i + 1}</span>
              <span>{m.title}</span>
            </div>
            <span style={{ color: 'var(--gray-400)', transform: open === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s', fontSize: '0.75rem' }}>▼</span>
          </button>
          {open === i && (
            <div className="accordion-body">
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span>🎬</span> ভিডিও লেকচার</span>
                {m.duration && <span>⏱ {m.duration}</span>}
              </div>
              {m.description && <p style={{ marginTop: '0.75rem' }}>{m.description}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
