'use client';
import { BookOpen, Code2, Palette, Megaphone, BarChart2, Briefcase } from 'lucide-react';

export default function CourseFilters() {
  const cats = [
    { n: 'সকল কোর্স', i: BookOpen }, { n: 'ওয়েব ডেভেলপমেন্ট', i: Code2 },
    { n: 'গ্রাফিক ডিজাইন', i: Palette }, { n: 'ডিজিটাল মার্কেটিং', i: Megaphone },
    { n: 'ডেটা সায়েন্স', i: BarChart2 }, { n: 'বিজনেস', i: Briefcase },
  ];

  return (
    <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 'calc(var(--header-h) + 1.5rem)' }}>
      <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-100)' }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-500)' }}>ক্যাটাগরি</p>
        </div>
        {cats.map((c, i) => (
          <button key={i} style={{
            width: '100%', padding: '0.75rem 1.25rem', border: 'none',
            background: i === 0 ? '#f0fdf4' : 'transparent',
            textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
            fontFamily: 'inherit', fontWeight: i === 0 ? 700 : 500,
            fontSize: 'var(--text-sm)', color: i === 0 ? '#15803d' : 'var(--gray-700)',
            borderLeft: i === 0 ? '3px solid var(--lime)' : '3px solid transparent',
            transition: 'var(--transition)',
          }}><c.i size={16} />{c.n}</button>
        ))}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--gray-100)' }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-500)', marginBottom: '0.75rem' }}>কোর্স টাইপ</p>
          {[['সকল', '0'], ['ফ্রি কোর্স', '1'], ['প্রিমিয়াম কোর্স', '2']].map(([label, val]) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--gray-700)', fontWeight: 500 }}>
              <input type="radio" name="type" defaultChecked={val === '0'} style={{ accentColor: 'var(--lime)' }} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
