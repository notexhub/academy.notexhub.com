'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Folder, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const inp = { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: '#fff' };
const lbl = { fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await fetch('/api/admin/categories?all=true');
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []); setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openForm = (cat = null) => {
    if (cat) {
      setForm({ name: cat.name, description: cat.description });
      setEditId(cat._id);
    } else {
      setForm({ name: '', description: '' });
      setEditId(null);
    }
    setModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editId, ...form }) });
    } else {
      await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setModal(false); load();
  };

  const del = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
    load();
  };

  const toggle = async (id, isActive) => {
    await fetch('/api/admin/categories', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isActive: !isActive }) });
    load();
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>কোর্স অর্গানাইজেশন</p>
          <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>ক্যাটাগরি ম্যানেজমেন্ট</h2>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#0f172a] text-[#CCFF00] hover:bg-[#1e293b] transition-colors">
          <Plus size={16} /> নতুন ক্যাটাগরি
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden bg-white border border-[#f1f5f9] shadow-sm">
        <table className="w-full">
           <thead>
             <tr className="border-b border-[#f1f5f9]">
               <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94a3b8] bg-[#fafafa]">ক্যাটাগরির নাম</th>
               <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94a3b8] bg-[#fafafa]">স্ল্যাগ</th>
               <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94a3b8] bg-[#fafafa]">স্ট্যাটাস</th>
               <th className="text-right px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#94a3b8] bg-[#fafafa]">অ্যাকশন</th>
             </tr>
           </thead>
           <tbody>
             {loading ? <tr><td colSpan={4} className="text-center py-12 text-[#94a3b8]">লোড হচ্ছে...</td></tr> : 
              (!categories || categories.length === 0) ? <tr><td colSpan={4} className="text-center py-12 text-[#94a3b8]">কোনো ক্যাটাগরি নেই</td></tr> :
              categories?.map(c => (
                <tr key={c._id} className="border-b border-[#f8fafc] hover:bg-[#fafafa]">
                  <td className="px-5 py-3.5">
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 bg-[#f0f9ff] text-[#0ea5e9] flex items-center justify-center rounded-lg"><Folder size={16} /></div>
                       <div>
                         <p className="font-bold text-sm text-[#0f172a]">{c.name}</p>
                         {c.description && <p className="text-xs text-[#64748b]">{c.description}</p>}
                       </div>
                     </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#64748b]">{c.slug}</td>
                  <td className="px-5 py-3.5">
                     <button onClick={() => toggle(c._id, c.isActive)} className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 w-max transition-colors ${c.isActive ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#dc2626]'}`}>
                       {c.isActive ? <Check size={10} /> : <X size={10} />} {c.isActive ? 'সক্রিয়' : 'বন্ধ'}
                     </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => openForm(c)} className="w-8 h-8 flex items-center justify-center bg-[#f1f5f9] text-[#475569] rounded-lg hover:bg-[#0f172a] hover:text-[#CCFF00] transition-colors"><Pencil size={14} /></button>
                       <button onClick={() => del(c._id)} className="w-8 h-8 flex items-center justify-center bg-[#fee2e2] text-[#dc2626] rounded-lg hover:bg-[#dc2626] hover:text-white transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#0f172a]">{editId ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4 mt-2">
            <div>
              <label style={lbl}>ক্যাটাগরির নাম *</label>
              <input style={inp} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="যেমন: Web Development" required />
            </div>
            <div>
              <label style={lbl}>ছোট বিবরণ (ঐচ্ছিক)</label>
              <textarea style={{...inp, height: 80, resize: 'none'}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="এই ক্যাটাগরি সম্পর্কে কিছু লিখুন..." />
            </div>
            <button type="submit" className="w-full bg-[#0f172a] text-[#CCFF00] font-black py-3 rounded-xl hover:bg-[#1e293b]">
               {editId ? 'আপডেট করুন' : 'তৈরি করুন'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
