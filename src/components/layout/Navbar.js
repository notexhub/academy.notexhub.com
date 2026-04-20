'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, Search } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated, token: reduxToken, loading: authLoadingState } = useSelector((state) => state.auth);
  const [logoData, setLogoData] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(!isAuthenticated);

  useEffect(() => {
    // If not authenticated in Redux, try to fetch from session cookie
    if (!isAuthenticated) {
      setSessionLoading(true);
      fetch('/api/auth/me')
        .then(r => r.json())
        .then(d => {
          if (d.authenticated && d.user) {
            // Passive restore: Keep existing token if server doesn't provide one
            dispatch(loginSuccess({ 
              user: d.user, 
              token: d.token || reduxToken 
            }));
          }
          setSessionLoading(false);
        })
        .catch(() => setSessionLoading(false));
    } else {
      setSessionLoading(false);
    }

    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d && d.websiteLogoBase64) {
          setLogoData(d.websiteLogoBase64);
        }
      })
      .catch(() => {});
  }, [isAuthenticated, dispatch]);

  const authLoading = authLoadingState || sessionLoading;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(logout());
      window.location.href = '/';
    } catch (err) {
      dispatch(logout());
      window.location.href = '/';
    }
  };

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
          <img 
            src="/logo.png" 
            alt="NotexHub Academy Logo" 
            style={{ 
              height: '64px', 
              width: 'auto', 
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              marginTop: '-10px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }} 
            className="hover:scale-105"
          />
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
          <Search size={15} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
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
          {authLoading ? (
             <div style={{ width: 150, height: 38, background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 pr-3 pl-1 py-1 bg-[#f8fafc] rounded-full border border-[#f1f5f9] mr-1">
                 <div className="w-7 h-7 rounded-full bg-[#0f172a] text-[#CCFF00] flex items-center justify-center font-black text-xs">
                   {user.name?.[0]?.toUpperCase()}
                 </div>
                 <span className="text-[12px] font-bold text-[#0f172a] whitespace-nowrap">{user.name?.split(' ')[0]}</span>
              </div>

              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-1.5 px-4 py-2 bg-[#0f172a] text-[#CCFF00] rounded-full text-[13px] font-bold hover:bg-[#1e293b] transition-colors shadow-sm whitespace-nowrap">
                <LayoutDashboard size={15} /> ড্যাশবোর্ড
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#ef4444] border border-[#fee2e2] rounded-full text-[13px] font-bold hover:bg-[#fef2f2] transition-colors shadow-sm whitespace-nowrap"
              >
                <LogOut size={15} /> লগ আউট
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-sm">লগ ইন</Link>
              <Link href="/register" className="btn btn-navy btn-sm">জয়েন করুন</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

