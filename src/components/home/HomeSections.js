'use client';
import Link from 'next/link';
import {
  Code2, Palette, Megaphone, BarChart2, Briefcase,
  Smartphone, ShieldCheck, Tag
} from 'lucide-react';

const CAT_COLORS = [
  { bg: '#dbeafe', icColor: '#1d4ed8' },
  { bg: '#fce7f3', icColor: '#be185d' },
  { bg: '#dcfce7', icColor: '#15803d' },
  { bg: '#ede9fe', icColor: '#7c3aed' },
  { bg: '#fef9c3', icColor: '#a16207' },
  { bg: '#ffedd5', icColor: '#c2410c' },
];

const CAT_ICONS = {
  'ওয়েব ডেভেলপমেন্ট': Code2,
  'গ্রাফিক ডিজাইন': Palette,
  'ডিজিটাল মার্কেটিং': Megaphone,
  'ডেটা সায়েন্স': BarChart2,
  'বিজনেস': Briefcase,
  'প্রোগ্রামিং': Code2,
  'মোবাইল অ্যাপ': Smartphone,
  'সাইবার সিকিউরিটি': ShieldCheck,
};

export function HomeCategoriesSection({ categories }) {
  return (
    <section style={{ padding: '6rem 0', background: '#f8fafc' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', background: '#f0fdf4', color: '#15803d', fontSize: 12, fontWeight: 700, padding: '5px 16px', borderRadius: 50, border: '1px solid #bbf7d0', marginBottom: 16, letterSpacing: '0.06em', textTransform: 'uppercase' }}>ক্যাটাগরি</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>পছন্দের বিষয় বেছে নিন</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto' }}>আপনার ক্যারিয়ার গোলের উপর ভিত্তি করে সঠিক ট্র্যাক বেছে নিন।</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
          {categories.map((cat, i) => (
            <Link key={cat._id || cat.name}
              href={`/courses?category=${encodeURIComponent(cat.name)}`}
              style={{ display: 'block', textDecoration: 'none' }}>
              <CategoryCard cat={cat} index={i} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }) {
  const Icon = CAT_ICONS[cat.name] || Tag;
  const { bg, icColor } = CAT_COLORS[index % CAT_COLORS.length];

  return (
    <div style={{
      background: 'white', border: '1.5px solid #f1f5f9', borderRadius: 20,
      padding: '1.75rem 1rem', textAlign: 'center', cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = '#CCFF00';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#f1f5f9';
      }}
    >
      <div style={{
        width: 56, height: 56, background: bg, borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 0.9rem',
        boxShadow: `0 4px 16px ${bg}`,
      }}>
        <Icon size={26} style={{ color: icColor }} />
      </div>
      <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', lineHeight: 1.3 }}>{cat.name}</p>
    </div>
  );
}

export function HomePartnersSection({ partnerNames }) {
  return (
    <section style={{ padding: '4rem 0', background: 'white', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
      <div className="container">
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2.5rem' }}>আমাদের গ্র্যাজুয়েটরা যেখানে কর্মরত</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem 4rem', alignItems: 'center' }}>
          {partnerNames.map(name => (
            <span key={name}
              style={{ fontSize: '1.35rem', fontWeight: 900, color: '#d1d5db', letterSpacing: '-0.03em', transition: 'color 0.2s', cursor: 'default', userSelect: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
            >{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
