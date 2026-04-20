'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Download, Award, Infinity as InfinityIcon, CheckCircle,
  TrendingUp, Users, Star, ArrowRight, Code2, Palette, BarChart2, Globe
} from 'lucide-react';

export default function Hero() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = 12000;
    const dur = 2000;
    const step = Math.ceil(end / (dur / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { val: `${count.toLocaleString()}+`, label: 'শিক্ষার্থী' },
    { val: '২০০+', label: 'কোর্স' },
    { val: '৯৮%', label: 'সন্তুষ্টি হার' },
    { val: '৫০০+', label: 'সার্টিফিকেট' },
  ];

  const features = [
    { icon: InfinityIcon, text: 'আনলিমিটেড কোর্স' },
    { icon: Download, text: 'কন্টেন্ট ডাউনলোড' },
    { icon: Award, text: 'অফিশিয়াল সার্টিফিকেট' },
    { icon: CheckCircle, text: 'একটি সাবস্ক্রিপশনে সব' },
  ];

  const previews = [
    { icon: Code2, title: 'কমপ্লিট ওয়েব ডেভেলপমেন্ট', meta: '৪৮ ঘণ্টা · ৩.২k+ শিক্ষার্থী', badge: 'জনপ্রিয়', bc: '#CCFF00', tc: '#0a1628', prog: 72 },
    { icon: Palette, title: 'গ্রাফিক্স ডিজাইন মাস্টারক্লাস', meta: '৩২ ঘণ্টা · ২.৪k+ শিক্ষার্থী', badge: 'নতুন', bc: '#3b82f6', tc: 'white', prog: 55 },
    { icon: BarChart2, title: 'ডিজিটাল মার্কেটিং মাস্টারি', meta: '২৮ ঘণ্টা · ১.৮k+ শিক্ষার্থী', badge: 'ট্রেন্ডিং', bc: '#f472b6', tc: 'white', prog: 38 },
  ];

  const avatarLetters = ['M', 'R', 'S', 'A', 'T'];

  return (
    <section style={{
      background: 'linear-gradient(135deg, #060d1b 0%, #0a1628 40%, #091220 100%)',
      minHeight: '92vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(204,255,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

          {/* LEFT */}
          <div>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.2)', borderRadius: 50, padding: '6px 16px', marginBottom: '1.75rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#CCFF00', display: 'inline-block', boxShadow: '0 0 10px #CCFF00' }} />
              <span style={{ color: '#CCFF00', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={13} /> একটি সাবস্ক্রিপশন — সব কোর্স আনলিমিটেড
              </span>
            </div>

            <h1 style={{ fontSize: '3.75rem', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              একটি প্ল্যানেই<br />
              <span style={{ background: 'linear-gradient(90deg, #CCFF00, #a3e635)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>২০০+ কোর্স দেখুন</span><br />
              <span style={{ color: '#e2e8f0', fontSize: '3rem' }}>ডাউনলোড করুন, সার্টিফিকেট নিন।</span>
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: 500 }}>
              মাত্র একটি সাবস্ক্রিপশনে আমাদের সমস্ত কোর্স দেখুন, পছন্দের কন্টেন্ট ডাউনলোড করুন এবং কোর্স শেষ করে অফিশিয়াল সার্টিফিকেট নিন।
            </p>

            {/* Feature pills — lucide icons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2.5rem' }}>
              {features.map(({ icon: Icon, text }) => (
                <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#e2e8f0', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 50 }}>
                  <Icon size={13} style={{ color: '#CCFF00' }} /> {text}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#CCFF00', color: '#0a1628', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 0 32px rgba(204,255,0,0.25)' }}>
                সাবস্ক্রিপশন দেখুন <ArrowRight size={16} />
              </Link>
              <Link href="/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', color: 'white', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                <BookOpen size={15} /> সব কোর্স দেখুন
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              {stats.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#CCFF00', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex' }}>
                {avatarLetters.map((l, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${i * 60 + 80}, 70%, 40%)`, border: '2px solid #0a1628', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 800 }}>{l}</div>
                ))}
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: '#CCFF00', fontWeight: 800 }}>৩৪০ জন</span> এই সপ্তাহে সাবস্ক্রাইব করেছেন
              </p>
            </div>
          </div>

          {/* RIGHT — Card */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '2rem', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <p style={{ color: '#64748b', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>সাবস্ক্রাইব করলেই পাবেন</p>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(204,255,0,0.15)', color: '#CCFF00', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  <InfinityIcon size={11} /> সব কোর্স
                </span>
              </div>

              {previews.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.9rem 1rem', background: i === 0 ? 'rgba(204,255,0,0.06)' : 'rgba(255,255,255,0.04)', borderRadius: 14, border: `1px solid ${i === 0 ? 'rgba(204,255,0,0.15)' : 'rgba(255,255,255,0.06)'}`, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CCFF00', flexShrink: 0 }}>
                  <p.icon size={24} />
                </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                    <div style={{ color: '#64748b', fontSize: 11, marginBottom: 5 }}>{p.meta}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${p.prog}%`, height: '100%', background: p.bc === '#CCFF00' ? '#CCFF00' : p.bc, borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0 }}>{p.prog}%</span>
                    </div>
                  </div>
                  <span style={{ background: p.bc, color: p.tc, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>{p.badge}</span>
                </div>
              ))}

              <div style={{ marginTop: '1rem', background: 'linear-gradient(135deg, rgba(204,255,0,0.08), rgba(204,255,0,0.03))', border: '1px solid rgba(204,255,0,0.15)', borderRadius: 12, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                <InfinityIcon size={22} style={{ color: '#CCFF00', flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>১টি সাবস্ক্রিপশনে ২০০+ কোর্স এক্সেস!</p>
                  <p style={{ color: '#CCFF00', fontSize: 11, marginTop: 2 }}>ডাউনলোড করুন · সার্টিফিকেট নিন</p>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position: 'absolute', top: -20, right: -18, background: 'white', borderRadius: 16, padding: '10px 16px', boxShadow: '0 16px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={20} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Top Rated</div>
                <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>5.0 / 5.0</div>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: -18, left: -18, background: '#0f172a', border: '1px solid rgba(204,255,0,0.2)', borderRadius: 14, padding: '10px 16px', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#CCFF00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} style={{ color: '#0a1628' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>Rakib সার্টিফিকেট পেয়েছেন!</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>মাত্র ২ মিনিট আগে</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
