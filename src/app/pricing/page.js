'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) setUser(d.user);
        setLoadingUser(false);
      })
      .catch(() => setLoadingUser(false));

    fetch('/api/public/plans')
      .then(r => r.json())
      .then(d => {
        setPlans(Array.isArray(d) ? d : []);
        setLoadingPlans(false);
      })
      .catch(() => setLoadingPlans(false));
  }, []);

  const getUrl = (p) => {
    if (p.price === 0 || p.slug === 'free') return '/register';
    const checkoutUrl = `/checkout?plan=${p.slug}`;
    if (user) return checkoutUrl;
    return `/login?redirect=${encodeURIComponent(checkoutUrl)}`;
  };

  return (
    <main>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #111827)', padding: '80px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <div className="label" style={{ background: 'rgba(198,241,53,0.1)', color: 'var(--lime)', borderColor: 'rgba(198,241,53,0.25)' }}>প্রাইসিং</div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>সঠিক প্ল্যান বেছে নিন</h1>
          <p style={{ color: '#94a3b8', fontSize: 'var(--text-lg)', maxWidth: 520, margin: '0 auto' }}>সাশ্রয়ী মূল্যে বিশ্বমানের শিক্ষা — যেকোনো বাজেটে শিখুন।</p>
        </div>
      </section>

      <section style={{ background: 'var(--gray-50)', padding: '80px 0' }}>
        <div className="container">
          {loadingPlans ? (
            <div className="text-center py-16 text-[#94a3b8] font-bold">প্ল্যানগুলো লোড হচ্ছে...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16 text-[#94a3b8] font-bold">দুঃখিত, বর্তমানে কোনো সাবস্ক্রিপশন প্ল্যান এভেইলেবল নেই।</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
              {plans.map((p) => (
                <div key={p._id} style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: p.primary ? '2px solid var(--lime)' : '1px solid var(--gray-200)', padding: '2.5rem', position: 'relative', boxShadow: p.primary ? '0 20px 40px rgba(198,241,53,0.15)' : 'var(--shadow-sm)' }}>
                  {p.badge && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--lime)', color: 'var(--navy)', padding: '0.25rem 1rem', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 800, whiteSpace: 'nowrap' }}>{p.badge}</div>}
                  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{p.name}</h3>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{p.displayPrice}</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)', marginLeft: '0.4rem' }}>/ {p.periodText}</span>
                  </div>
                  
                  {loadingUser ? (
                     <div className="btn btn-block btn-lg btn-outline" style={{ marginBottom: '2rem', opacity: 0.5 }}>লোড হচ্ছে...</div>
                  ) : (
                    <Link href={getUrl(p)} className={`btn btn-block btn-lg ${p.primary ? 'btn-lime' : 'btn-outline'}`} style={{ marginBottom: '2rem' }}>{p.cta || 'শুরু করুন'}</Link>
                  )}

                  <div className="divider" />
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    {p.features?.map((f, idx) => <li key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}><span style={{ color: '#16a34a' }}>✓</span>{f}</li>)}
                    {p.notIncluded?.map((f, idx) => <li key={idx} style={{ display: 'flex', gap: '0.6rem', fontSize: 'var(--text-sm)', color: 'var(--gray-300)', textDecoration: 'line-through' }}><span>✗</span>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
