'use client';
import { useState, useEffect } from 'react';
import { Users, BookOpen, Search, Filter } from 'lucide-react';

export default function EnrollmentManager() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetch('/api/admin/enrollments')
      .then(r => r.json())
      .then(d => { setEnrollments(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(e => {
    const matchSearch = !search ||
      e.userName?.toLowerCase().includes(search.toLowerCase()) ||
      e.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      e.courseTitle?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || e.type === filterType;
    return matchSearch && matchType;
  });

  const counts = {
    all: enrollments.length,
    free: enrollments.filter(e => e.type === 'free').length,
    subscription: enrollments.filter(e => e.type === 'subscription').length,
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>শিক্ষার্থী ব্যবস্থাপনা</p>
        <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>এনরোলমেন্ট হিস্ট্রি</h2>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>মোট {counts.all} টি এনরোলমেন্ট</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'মোট এনরোলমেন্ট', value: counts.all, color: '#6366f1', bg: '#eef2ff' },
          { label: 'ফ্রি কোর্স', value: counts.free, color: '#10b981', bg: '#dcfce7' },
          { label: 'সাবস্ক্রিপশন', value: counts.subscription, color: '#f59e0b', bg: '#fef9c3' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="নাম, ইমেইল বা কোর্স খুঁজুন..."
            style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: 'white' }}
          />
        </div>
        <div className="flex gap-2">
          {[['all', 'সকল'], ['free', 'ফ্রি'], ['subscription', 'সাবস্ক্রিপশন']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterType(val)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${filterType === val ? 'bg-[#0f172a] text-[#CCFF00]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['শিক্ষার্থী', 'কোর্স', 'ধরন', 'এনরোলের তারিখ'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8', background: '#fafafa' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-16 text-sm" style={{ color: '#94a3b8' }}>লোড হচ্ছে...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-16" style={{ color: '#94a3b8' }}>
                <Users size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">কোনো এনরোলমেন্ট পাওয়া যায়নি</p>
              </td></tr>
            ) : filtered.map((e, i) => (
              <tr key={e._id || i} style={{ borderBottom: '1px solid #f8fafc' }} className="hover:bg-[#fafafa] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0" style={{ background: '#0f172a', color: '#CCFF00' }}>
                      {e.userName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{e.userName || 'Unknown'}</p>
                      <p className="text-xs" style={{ color: '#94a3b8' }}>{e.userEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <span className="text-sm font-medium line-clamp-1" style={{ color: '#374151' }}>{e.courseTitle || 'Unknown Course'}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: e.type === 'free' ? '#dcfce7' : e.type === 'subscription' ? '#dbeafe' : '#f1f5f9',
                      color: e.type === 'free' ? '#15803d' : e.type === 'subscription' ? '#1d4ed8' : '#475569'
                    }}>
                    {e.type === 'free' ? 'ফ্রি' : e.type === 'subscription' ? 'সাবস্ক্রিপশন' : 'অ্যাডমিন'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm" style={{ color: '#64748b' }}>
                  {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
