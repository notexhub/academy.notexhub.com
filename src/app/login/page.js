'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Suspense } from 'react';
import { loginSuccess } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';

function LoginContent() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        // Give redux-persist 150ms to flush state to localStorage before navigation
        setTimeout(() => {
          if (redirect) window.location.href = redirect;
          else window.location.href = data.user?.role === 'admin' ? '/admin' : '/dashboard';
        }, 150);
      }
      else setError(data.error || 'লগইন ব্যর্থ হয়েছে');
    } catch { setError('নেটওয়ার্ক সমস্যা হয়েছে'); }
    setLoading(false);
  };

  const benefits = [
    { text: 'বিশেষজ্ঞ ইন্সট্রাক্টর' },
    { text: 'লাইফটাইম এক্সেস' },
    { text: 'সার্টিফিকেট প্রোগ্রাম' },
    { text: 'ক্যারিয়ার সাপোর্ট' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex' }}>
      {/* Left branding panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0a1628, #111827)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(198,241,53,0.05)' }} />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '3rem' }}>
          <div style={{ width: 44, height: 44, background: 'var(--lime)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--navy)', fontWeight: 900, fontSize: '1.5rem' }}>N</span>
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>নোটেক্সহাব</span>
        </Link>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '1rem' }}>হাজারো শিক্ষার্থীর সাথে শিখুন</h2>
        <p style={{ color: '#64748b', fontSize: 'var(--text-lg)', lineHeight: 1.8 }}>বাংলাদেশের সেরা ইন্ডাস্ট্রি মেন্টরদের কাছ থেকে হাতে–কলমে শিখুন।</p>
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {benefits.map(b => (
            <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94a3b8', fontSize: 'var(--text-sm)' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--lime)', flexShrink: 0 }} /> {b.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div style={{ width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.5rem' }}>স্বাগত ফিরে আসায়</h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', fontSize: 'var(--text-sm)' }}>আপনার অ্যাকাউন্টে লগ ইন করুন</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">ইমেইল অ্যাড্রেস</label>
              <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">পাসওয়ার্ড</label>
              <input type="password" className="form-input" placeholder="আপনার পাসওয়ার্ড" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-navy btn-block btn-lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '...' : 'লগ ইন করুন'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginTop: '1.5rem', fontSize: 'var(--text-sm)' }}>
            অ্যাকাউন্ট নেই? <Link href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"} style={{ color: 'var(--navy)', fontWeight: 700 }}>বিনামূল্যে রেজিস্ট্রেশন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>}>
      <LoginContent />
    </Suspense>
  );
}
