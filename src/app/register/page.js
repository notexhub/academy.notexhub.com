'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/slices/authSlice';

function RegisterContent() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        if (redirect) window.location.href = redirect;
        else window.location.href = data.role === 'admin' ? '/admin' : '/dashboard';
      }
      else setError(data.error || 'রেজিস্ট্রেশন সম্পন্ন হয়নি');
    } catch { setError('নেটওয়ার্ক সমস্যা হয়েছে'); }
    setLoading(false);
  };

  const f = (k) => (e) => setForm({...form, [k]: e.target.value});

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex' }}>
      {/* Left */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #0a1628, #111827)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(198,241,53,0.04)' }} />
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '3rem' }}>
          <div style={{ width: 44, height: 44, background: 'var(--lime)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--navy)', fontWeight: 900, fontSize: '1.5rem' }}>N</span>
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white' }}>নোটেক্সহাব</span>
        </Link>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '1rem' }}>আজই যাত্রা শুরু করুন</h2>
        <p style={{ color: '#64748b', fontSize: 'var(--text-lg)', lineHeight: 1.8, marginBottom: '2rem' }}>ফ্রিতে অ্যাকাউন্ট খুলুন এবং ক্যারিয়ার ট্র্যাক শুরু করুন।</p>
        <div style={{ background: 'rgba(198,241,53,0.08)', border: '1px solid rgba(198,241,53,0.2)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <p style={{ color: 'var(--lime)', fontWeight: 700, marginBottom: '0.5rem' }}>🎁 ফ্রি একাউন্টে যা পাবেন:</p>
          {['সকল ফ্রি কোর্স আনলিমিটেড', 'কোর্স প্রগ্রেস ট্র্যাকিং', 'কমিউনিটি ফোরাম এক্সেস', 'প্রিমিয়াম ট্রায়াল ৭ দিন'].map(t => (
            <p key={t} style={{ color: '#94a3b8', fontSize: 'var(--text-sm)', marginTop: '0.4rem' }}>✓ {t}</p>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: 'white' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: '0.5rem' }}>নতুন অ্যাকাউন্ট খুলুন</h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem', fontSize: 'var(--text-sm)' }}>সম্পূর্ণ বিনামূল্যে — কোনো ক্রেডিট কার্ড লাগবে না</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">পূর্ণ নাম</label>
              <input type="text" className="form-input" placeholder="আপনার নাম লিখুন" value={form.name} onChange={f('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">ইমেইল অ্যাড্রেস</label>
              <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={f('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">পাসওয়ার্ড</label>
              <input type="password" className="form-input" placeholder="কমপক্ষে ৬ অক্ষর" value={form.password} onChange={f('password')} minLength={6} required />
            </div>
            <button type="submit" className="btn btn-lime btn-block btn-lg" disabled={loading}>
              {loading ? '...' : 'অ্যাকাউন্ট তৈরি করুন →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', marginTop: '1rem', fontSize: 'var(--text-xs)', lineHeight: 1.7 }}>
            রেজিস্ট্রেশন করলে আমাদের <Link href="/terms" style={{ color: 'var(--navy)' }}>Terms of Service</Link> এবং <Link href="/privacy" style={{ color: 'var(--navy)' }}>Privacy Policy</Link> মেনে নিচ্ছেন।
          </p>
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginTop: '1.5rem', fontSize: 'var(--text-sm)' }}>
            অ্যাকাউন্ট আছে? <Link href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"} style={{ color: 'var(--navy)', fontWeight: 700 }}>লগ ইন করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
