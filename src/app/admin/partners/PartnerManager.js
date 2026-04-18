'use client';
import { useState, useEffect } from 'react';
import { Building2, Trash2, Plus, ImageIcon } from 'lucide-react';

const inp = { width: '100%', padding: '0.6rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: '#fff' };

export default function PartnerManager() {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ companyName: '', logoBase64: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch('/api/admin/partners').then(r => r.json()).then(setPartners); }, []);

  const handleLogo = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = (ev) => setForm(f => ({ ...f, logoBase64: ev.target.result })); r.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/admin/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { const np = await res.json(); setPartners(p => [np, ...p]); setForm({ companyName: '', logoBase64: '' }); }
    setLoading(false);
  };

  const remove = async (id) => {
    await fetch('/api/admin/partners', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setPartners(p => p.filter(x => x._id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>কন্টেন্ট ম্যানেজমেন্ট</p>
        <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>পার্টনার কোম্পানি</h2>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>গ্রাজুয়েটরা যেসব কোম্পানিতে কর্মরত — মোট {partners.length}টি</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-1">
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: '#0f172a' }}><Building2 size={15} /> নতুন কোম্পানি</h3>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>কোম্পানির নাম *</label>
                <input style={inp} value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="যেমন: Pathao, bKash" required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>লোগো</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1.5px dashed #e2e8f0', borderRadius: 10, cursor: 'pointer', background: '#fafafa' }}>
                  <ImageIcon size={15} style={{ color: '#94a3b8' }} />
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>লোগো আপলোড করুন</span>
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
                </label>
                {form.logoBase64 && <img src={form.logoBase64} style={{ marginTop: 8, height: 48, objectFit: 'contain', borderRadius: 6, border: '1px solid #e2e8f0', padding: 4 }} alt="logo" />}
              </div>
              <button type="submit" disabled={loading} style={{ padding: '10px 0', borderRadius: 10, background: '#CCFF00', color: '#0f172a', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                {loading ? 'যোগ হচ্ছে...' : '+ কোম্পানি যোগ করুন'}
              </button>
            </form>
          </div>
        </div>

        {/* Grid */}
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-4">
            {partners.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-sm" style={{ color: '#94a3b8' }}>কোনো কোম্পানি নেই</div>
            ) : partners.map(p => (
              <div key={p._id} className="rounded-xl p-4 flex flex-col items-center gap-3 relative group" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="w-16 h-12 flex items-center justify-center" style={{ background: '#f8fafc', borderRadius: 8 }}>
                  {p.logoBase64 ? <img src={p.logoBase64} style={{ maxHeight: 44, maxWidth: 60, objectFit: 'contain' }} alt={p.companyName} /> : <Building2 size={24} style={{ color: '#cbd5e1' }} />}
                </div>
                <p className="text-xs font-semibold text-center" style={{ color: '#374151' }}>{p.companyName}</p>
                <button onClick={() => remove(p._id)} style={{ position: 'absolute', top: 8, right: 8, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', opacity: 0 }} className="group-hover:opacity-100 transition-opacity">
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
