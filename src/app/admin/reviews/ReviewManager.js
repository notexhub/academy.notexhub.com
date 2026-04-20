'use client';
import { useState, useEffect } from 'react';
import { Star, Trash2, Plus } from 'lucide-react';

const inp = { width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: '#fff' };

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ studentName: '', role: '', quote: '', courseId: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    fetch('/api/admin/reviews').then(r => r.json()).then(setReviews);
    fetch('/api/courses').then(r => r.json()).then(setCourses);
  }, []);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/admin/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { 
      const nr = await res.json(); 
      setReviews(p => [nr, ...p]); 
      setForm({ studentName: '', role: '', quote: '', courseId: '', rating: 5 }); 
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    const res = await fetch('/api/admin/reviews', { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id, status }) 
    });
    if (res.ok) {
      setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    }
  };

  const remove = async (id) => {
    if (!confirm('মুছবেন?')) return;
    await fetch('/api/admin/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setReviews(r => r.filter(x => x._id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>কন্টেন্ট ম্যানেজমেন্ট</p>
        <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>রিভিউ ম্যানেজমেন্ট</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-1">
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}><Plus size={16} style={{ color: '#CCFF00', background: '#0f172a', borderRadius: 4, padding: 2 }} /> নতুন রিভিউ</h3>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>কোর্স সিলেক্ট করুন</label>
                <select style={inp} value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
                  <option value="">জেনারেল রিভিউ (কোনো নির্দিষ্ট কোর্স নয়)</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
              {[['studentName', 'শিক্ষার্থীর নাম *', 'পূর্ণ নাম', true], ['role', 'পেশা *', 'যেমন: Developer', true]].map(([k, label, ph, req]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input style={inp} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} required={req} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>রেটিং (১-৫) *</label>
                <input type="number" min="1" max="5" style={inp} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>রিভিউ *</label>
                <textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} placeholder="শিক্ষার্থীর অভিজ্ঞতা..." required />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '10px 0', borderRadius: 10, background: '#CCFF00', color: '#0f172a', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'যোগ হচ্ছে...' : '+ রিভিউ যোগ করুন'}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="col-span-2">
          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['শিক্ষার্থী', 'রেটিং', 'স্ট্যাটাস', 'রিভিউ', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8', background: '#fafafa' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-sm" style={{ color: '#94a3b8' }}>কোনো রিভিউ নেই</td></tr>
                ) : reviews.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{r.studentName}</p>
                      <p style={{ fontSize: 10, color: '#94a3b8' }}>{r.role}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-0.5"><Star size={10} style={{ color: '#fbbf24', fill: '#fbbf24' }} /> <span className="text-xs font-bold">{r.rating || 5}</span></div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ 
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, 
                        background: r.status === 'approved' ? '#dcfce7' : r.status === 'pending' ? '#fef9c3' : '#fee2e2',
                        color: r.status === 'approved' ? '#166534' : r.status === 'pending' ? '#854d0e' : '#991b1b'
                      }}>
                        {r.status === 'approved' ? 'Approved' : r.status === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><p className="text-xs line-clamp-2 italic max-w-[200px]" style={{ color: '#64748b' }}>&quot;{r.quote}&quot;</p></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        {r.status === 'pending' && (
                          <button onClick={() => updateStatus(r._id, 'approved')} style={{ background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 7, padding: '5px 9px', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}>Approve</button>
                        )}
                        <button onClick={() => remove(r._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 7, padding: '5px 9px', cursor: 'pointer' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
