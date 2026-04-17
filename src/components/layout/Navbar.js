'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { href: '/courses', label: 'কোর্সমূহ' },
    { href: '/pricing', label: 'প্রাইসিং' },
  ];

  return (
    <header style={{
      height: 'var(--header-h)', position: 'sticky', top: 0, zIndex: 999,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'var(--white)',
      borderBottom: `1px solid ${scrolled ? 'var(--gray-200)' : 'var(--gray-100)'}`,
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.3s var(--ease)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '1rem' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div className="logo-mark"><span>N</span></div>
          <span className="logo-text">নোটেক্সহাব</span>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)', fontWeight: 600,
              color: pathname.startsWith(l.href) ? 'var(--navy)' : 'var(--gray-600)',
              background: pathname.startsWith(l.href) ? 'var(--lime-light)' : 'transparent',
              transition: 'var(--transition)',
            }}>{l.label}</Link>
          ))}
        </nav>

        {/* Search */}
        <div style={{ position: 'relative', flex: '0 1 280px' }}>
          <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', fontSize: '0.9rem', pointerEvents: 'none' }}>🔍</span>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && q.trim() && router.push(`/search?q=${encodeURIComponent(q)}`)}
            placeholder="কি শিখতে চান?"
            className="form-input"
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)', height: '38px', padding: '0 1rem 0 2.5rem', fontSize: 'var(--text-sm)' }}
          />
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <Link href="/login" className="btn btn-outline btn-sm">লগ ইন</Link>
          <Link href="/register" className="btn btn-navy btn-sm">জয়েন করুন</Link>
        </div>
      </div>
    </header>
  );
}
