'use client';
import Link from 'next/link';
import { Heart, Share2, Send, Globe, PlayCircle } from 'lucide-react';

const cols = {
  'কোর্সসমূহ': [
    ['/courses', 'সকল কোর্স'], ['/courses', 'ওয়েব ডেভেলপমেন্ট'],
    ['/courses', 'গ্রাফিক ডিজাইন'], ['/courses', 'ডিজিটাল মার্কেটিং'],
  ],
  'প্ল্যাটফর্ম': [
    ['/pricing', 'প্রাইসিং প্ল্যান'], ['/dashboard', 'আমার কোর্স'],
    ['/login', 'লগ ইন'], ['/register', 'রেজিস্ট্রেশন'],
  ],
  'কোম্পানি': [
    ['/about', 'আমাদের সম্পর্কে'], ['/terms', 'Terms & Conditions'],
    ['/refund', 'Refund Policy'], ['/privacy', 'Privacy Policy'],
  ],
};

const socials = [
  { icon: Share2, href: '#', label: 'Facebook' },
  { icon: Send, href: '#', label: 'Twitter' },
  { icon: Globe, href: '#', label: 'LinkedIn' },
  { icon: PlayCircle, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'var(--white)' }}>
      <div className="container" style={{ padding: '64px 1.5rem 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', width: 'fit-content' }}>
              <div style={{ width: 38, height: 38, background: 'var(--lime)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--navy)', fontWeight: 900, fontSize: '1.3rem' }}>N</span>
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>নোটেক্সহাব</span>
            </Link>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 'var(--text-sm)', maxWidth: 300 }}>
              বাংলাদেশের সেরা অনলাইন লার্নিং প্ল্যাটফর্ম। একটি সাবস্ক্রিপশনে ২০০+ কোর্স, ডাউনলোড ও সার্টিফিকেট।
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem' }}>
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  style={{ width: 36, height: 36, background: '#1e3a5f', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#CCFF00'; e.currentTarget.style.color = '#0a1628'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1e3a5f'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '1.2rem' }}>{title}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {links.map(([href, label]) => (
                  <li key={label}><Link href={href} style={{ color: '#94a3b8', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #1e3a5f', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#64748b', fontSize: 'var(--text-sm)' }}>© 2025 নোটেক্সহাব। সকল স্বত্ব সংরক্ষিত।</p>
          <p style={{ color: '#64748b', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: 5 }}>
            Made with <Heart size={12} style={{ color: '#ef4444', fill: '#ef4444' }} /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
