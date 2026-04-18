'use client';
import { useState, useMemo } from 'react';
import CourseCard from '@/components/courses/CourseCard';
import { Search, SlidersHorizontal, X, BookOpen, Code2, Palette, Megaphone, BarChart2, Smartphone, ShieldCheck, Tag, SearchX, Zap, Gift } from 'lucide-react';

const CATEGORY_ICONS = {
  'ওয়েব ডেভেলপমেন্ট': Code2, 'গ্রাফিক ডিজাইন': Palette,
  'ডিজিটাল মার্কেটিং': Megaphone, 'ডেটা সায়েন্স': BarChart2,
  'বিজনেস': BarChart2, 'মোবাইল অ্যাপ': Smartphone, 'সাইবার সিকিউরিটি': ShieldCheck,
};

export default function CoursesClient({ courses, categories }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'free' | 'paid'
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'az' | 'free_first'

  const filtered = useMemo(() => {
    let list = [...(courses || [])];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCat !== 'all') {
      list = list.filter(c => c.category === selectedCat);
    }

    // Type
    if (selectedType === 'free') list = list.filter(c => c.isFree);
    if (selectedType === 'paid') list = list.filter(c => !c.isFree);

    // Sort
    if (sortBy === 'az') list.sort((a, b) => a.title?.localeCompare(b.title));
    else if (sortBy === 'free_first') list.sort((a, b) => (b.isFree ? 1 : 0) - (a.isFree ? 1 : 0));
    // newest is default DB order

    return list;
  }, [courses, search, selectedCat, selectedType, sortBy]);

  const hasFilters = selectedCat !== 'all' || selectedType !== 'all' || search.trim();

  const clearAll = () => {
    setSelectedCat('all');
    setSelectedType('all');
    setSearch('');
    setSortBy('newest');
  };

  return (
    <section style={{ background: 'var(--gray-50)', paddingTop: 0 }}>
      <div className="container" style={{ display: 'flex', gap: '2rem', padding: '2.5rem 1.5rem', alignItems: 'flex-start' }}>

        {/* Sidebar Filters */}
        <aside style={{ width: 240, flexShrink: 0, position: 'sticky', top: 'calc(var(--header-h) + 1.5rem)' }}>
          <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>

            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={14} style={{ color: '#64748b' }} />
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>ফিল্টার</p>
              </div>
              {hasFilters && (
                <button onClick={clearAll} style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <X size={11} /> রিসেট
                </button>
              )}
            </div>

            {/* Category */}
            <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', padding: '0 1.25rem', marginBottom: '0.4rem' }}>ক্যাটাগরি</p>
              {/* All */}
              <button onClick={() => setSelectedCat('all')} style={{
                width: '100%', padding: '0.6rem 1.25rem', border: 'none',
                background: selectedCat === 'all' ? '#f0fdf4' : 'transparent',
                textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem',
                fontFamily: 'inherit', fontWeight: selectedCat === 'all' ? 700 : 500,
                fontSize: 13, color: selectedCat === 'all' ? '#15803d' : '#374151',
                borderLeft: selectedCat === 'all' ? '3px solid #CCFF00' : '3px solid transparent',
                transition: 'all 0.15s',
              }}>
                <BookOpen size={13} style={{ color: selectedCat === 'all' ? '#15803d' : '#94a3b8' }} /> সকল কোর্স
              </button>
              {categories?.map(cat => (
                <button key={cat._id} onClick={() => setSelectedCat(cat.name)} style={{
                  width: '100%', padding: '0.6rem 1.25rem', border: 'none',
                  background: selectedCat === cat.name ? '#f0fdf4' : 'transparent',
                  textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem',
                  fontFamily: 'inherit', fontWeight: selectedCat === cat.name ? 700 : 500,
                  fontSize: 13, color: selectedCat === cat.name ? '#15803d' : '#374151',
                  borderLeft: selectedCat === cat.name ? '3px solid #CCFF00' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  {(() => { const Icon = CATEGORY_ICONS[cat.name] || Tag; return <Icon size={13} style={{ color: selectedCat === cat.name ? '#15803d' : '#94a3b8', flexShrink: 0 }} />; })()}
                  <span style={{ flex: 1 }}>{cat.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#f1f5f9', color: '#64748b', borderRadius: 8, padding: '1px 6px' }}>
                    {courses?.filter(c => c.category === cat.name)?.length || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Type */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-100)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '0.75rem' }}>কোর্স টাইপ</p>
              {[['all', 'সকল'], ['free', 'ফ্রি কোর্স'], ['paid', 'প্রিমিয়াম কোর্স']].map(([val, label]) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', cursor: 'pointer', fontSize: 13, color: selectedType === val ? '#15803d' : '#374151', fontWeight: selectedType === val ? 700 : 500 }}>
                  <input type="radio" name="type" checked={selectedType === val} onChange={() => setSelectedType(val)} style={{ accentColor: '#CCFF00' }} />
                  {label}
                </label>
              ))}
            </div>

            {/* Sort */}
            <div style={{ padding: '1rem 1.25rem' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '0.75rem' }}>সাজানো</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: '#f8fafc' }}>
                <option value="newest">নতুন আগে</option>
                <option value="az">নাম অনুযায়ী (A-Z)</option>
                <option value="free_first">ফ্রি কোর্স আগে</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search + Stats Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="কোর্স খুঁজুন..."
                style={{ width: '100%', paddingLeft: 40, paddingRight: 12, paddingTop: '0.65rem', paddingBottom: '0.65rem', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'white', boxSizing: 'border-box' }}
              />
            </div>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, flexShrink: 0 }}>
              {hasFilters ? (
                <><span style={{ color: '#0f172a', fontWeight: 800 }}>{filtered.length}</span> টি ফলাফল</>
              ) : (
                <><span style={{ color: '#0f172a', fontWeight: 800 }}>{courses?.length || 0}</span> টি কোর্স</>
              )}
            </p>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {selectedCat !== 'all' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#0f172a', color: '#CCFF00', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                  {selectedCat}
                  <button onClick={() => setSelectedCat('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCFF00', display: 'flex', padding: 0 }}><X size={12} /></button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#0f172a', color: '#CCFF00', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                  {selectedType === 'free' ? 'ফ্রি কোর্স' : 'প্রিমিয়াম কোর্স'}
                  <button onClick={() => setSelectedType('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCFF00', display: 'flex', padding: 0 }}><X size={12} /></button>
                </span>
              )}
              {search.trim() && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#0f172a', color: '#CCFF00', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                  &quot;{search}&quot;
                  <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCFF00', display: 'flex', padding: 0 }}><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '4rem 2rem', textAlign: 'center' }}>
              <SearchX size={52} style={{ color: '#cbd5e1', margin: '0 auto 1rem', display: 'block' }} />
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>কোনো কোর্স পাওয়া যায়নি</h3>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: '1.5rem' }}>ফিল্টার পরিবর্তন করুন বা সার্চ টার্ম পরিষ্কার করুন।</p>
              <button onClick={clearAll} style={{ background: '#0f172a', color: '#CCFF00', padding: '0.65rem 1.5rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                সব ফিল্টার সরান
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {filtered.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
