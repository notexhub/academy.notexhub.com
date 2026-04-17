'use client';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const nav = [
    { n: 'ড্যাশবোর্ড', l: '/admin', i: '📊' },
    { n: 'কোর্স ম্যানেজমেন্ট', l: '/admin/courses', i: '🎓' },
    { n: 'রিভিউ ম্যানেজমেন্ট', l: '/admin/reviews', i: '⭐' },
    { n: 'পার্টনার লোগো', l: '/admin/partners', i: '🏢' },
    { n: 'ইউজার ম্যানেজমেন্ট', l: '/admin/users', i: '👥' },
    { n: 'সার্টিফিকেট অনুমোদন', l: '/admin/certificates', i: '🏆' },
  ];
  const active = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <aside style={{ width: 260, background: 'var(--navy)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ width: 38, height: 38, background: 'var(--lime)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'var(--navy)', fontWeight: 900, fontSize: '1.3rem' }}>N</span>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>নোটেক্সহাব</p>
              <p style={{ color: '#475569', fontSize: '0.7rem', marginTop: 2 }}>Admin Dashboard</p>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          <p style={{ color: '#374151', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 0.75rem 0.75rem', marginTop: '0.5rem' }}>মেনু</p>
          {nav.map(item => (
            <a key={item.l} href={item.l} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 0.9rem',
              borderRadius: 'var(--radius-md)', marginBottom: '0.2rem',
              background: active === item.l ? 'rgba(198,241,53,0.12)' : 'transparent',
              color: active === item.l ? 'var(--lime)' : '#94a3b8',
              fontWeight: 600, fontSize: 'var(--text-sm)', textDecoration: 'none',
              transition: 'var(--transition)',
              borderLeft: active === item.l ? '3px solid var(--lime)' : '3px solid transparent',
            }}>
              <span style={{ fontSize: '1.1rem', width: 22, textAlign: 'center' }}>{item.i}</span>
              {item.n}
            </a>
          ))}
        </nav>
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
            ← ওয়েবসাইটে ফিরে যান
          </a>
        </div>
      </aside>
      <div style={{ marginLeft: 260, flex: 1, minWidth: 0 }}>
        <header style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Admin Panel</h1>
          <span style={{ background: 'var(--lime-light)', color: '#5a7a00', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>Admin</span>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </div>
    </div>
  );
}
