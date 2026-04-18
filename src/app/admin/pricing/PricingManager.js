'use client';
import { useState, useEffect } from 'react';
import { Tags, Plus, Edit2, Trash2, X } from 'lucide-react';

const initPlan = { name: '', slug: '', price: 0, displayPrice: '', periodText: '', periodDays: 30, badge: '', features: '', notIncluded: '', cta: 'শুরু করুন', primary: false };

export default function PricingManager() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState(initPlan);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = () => {
    fetch('/api/admin/plans').then(r => r.json()).then(d => {
      setPlans(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  };

  const openNew = () => {
    setFormData(initPlan);
    setEditingPlan(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setFormData({
      ...p,
      features: p.features.join('\n'),
      notIncluded: p.notIncluded.join('\n')
    });
    setEditingPlan(p);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE' });
    load();
  };

  const saveForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...formData,
      features: formData.features.split('\n').map(s => s.trim()).filter(s => s),
      notIncluded: formData.notIncluded.split('\n').map(s => s.trim()).filter(s => s),
    };

    const method = editingPlan ? 'PATCH' : 'POST';
    if (editingPlan) payload._id = editingPlan._id;

    await fetch('/api/admin/plans', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    setSaving(false);
    setShowModal(false);
    load();
  };

  if (loading) return <div className="p-8 text-center text-[#94a3b8]">লোড হচ্ছে...</div>;

  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>ওয়েবসাইট কনফিগারেশন</p>
          <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>প্রাইসিং ম্যানেজমেন্ট</h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>এই প্ল্যানগুলো ওয়েবসাইটের প্রাইসিং পেজ এবং চেকআউটে প্রদর্শিত হবে।</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CCFF00] text-[#0f172a] text-xs font-bold hover:scale-105 transition-transform">
          <Plus size={14} /> নতুন প্ল্যান
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(p => (
          <div key={p._id} className="bg-white rounded-2xl border border-[#f1f5f9] p-6 shadow-sm relative" style={{borderTop: p.primary ? '4px solid #CCFF00' : ''}}>
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"><Edit2 size={14}/></button>
              <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 size={14}/></button>
            </div>
            {p.badge && <span className="inline-block px-2 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-xs font-bold rounded-md mb-2">{p.badge}</span>}
            <h3 className="text-lg font-bold text-[#0f172a]">{p.name}</h3>
            <p className="text-2xl font-black text-[#0f172a] my-2">{p.displayPrice} <span className="text-sm font-normal text-[#64748b]">/ {p.periodText}</span></p>
            <p className="text-xs text-[#94a3b8] mb-4">ভ্যালিডিটি: {p.periodDays} দিন | চেকআউট প্রাইস: ৳{p.price}</p>
            
            <div className="space-y-4 text-sm mt-4 border-t pt-4 border-[#f1f5f9]">
               <div>
                  <p className="font-bold text-[#0f172a] text-xs mb-1">সুবিধাসমূহ</p>
                  <ul className="text-[#64748b] pl-4 list-disc text-xs space-y-1">
                    {p.features?.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
               </div>
               {p.notIncluded?.length > 0 && (
                 <div>
                    <p className="font-bold text-[#0f172a] text-xs mb-1">যেসকল সুবিধা নেই</p>
                    <ul className="text-[#94a3b8] pl-4 list-disc text-xs space-y-1">
                      {p.notIncluded?.map((f, i) => <li key={i} className="line-through">{f}</li>)}
                    </ul>
                 </div>
               )}
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#94a3b8] bg-white rounded-2xl border border-[#f1f5f9]">
            কোনো প্ল্যান তৈরি করা হয়নি। নতুন প্ল্যান তৈরি করুন।
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#f1f5f9] flex justify-between items-center">
              <h3 className="text-lg font-black text-[#0f172a]">{editingPlan ? 'প্ল্যান এডিট করুন' : 'নতুন প্ল্যান'}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#94a3b8] hover:text-red-500"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="planForm" onSubmit={saveForm} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-1">নাম (Name)</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" placeholder="e.g., মান্থলি" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-1">স্লাগ (Slug)</label>
                    <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" placeholder="e.g., monthly" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-1">ডিসপ্লে প্রাইস</label>
                    <input required type="text" value={formData.displayPrice} onChange={e => setFormData({...formData, displayPrice: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" placeholder="e.g., ৳ ৯৯৯" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-1">অরিজিনাল প্রাইস (Number)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" placeholder="e.g., 999" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-1">মেয়াদের টেক্সট (Period Text)</label>
                    <input required type="text" value={formData.periodText} onChange={e => setFormData({...formData, periodText: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" placeholder="e.g., প্রতি মাসে" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-1">মেয়াদকাল (Period in Days)</label>
                    <input required type="number" value={formData.periodDays} onChange={e => setFormData({...formData, periodDays: Number(e.target.value)})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" placeholder="e.g., 30" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-1">ব্যাজ (Badge)</label>
                    <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" placeholder="e.g., সবচেয়ে জনপ্রিয়" />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="primaryCheck" checked={formData.primary} onChange={e => setFormData({...formData, primary: e.target.checked})} className="w-4 h-4 cursor-pointer" />
                    <label htmlFor="primaryCheck" className="text-sm font-bold text-[#0f172a] cursor-pointer">Mark as Primary/Highlighted Plan</label>
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-[#64748b] mb-1">সুবিধাসমূহ (Features - ১ লাইনে ১টি)</label>
                   <textarea rows={4} required value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm font-mono"></textarea>
                </div>
                <div>
                   <label className="block text-xs font-bold text-[#64748b] mb-1">যেসকল সুবিধা নেই (Not Included - ১ লাইনে ১টি)</label>
                   <textarea rows={3} value={formData.notIncluded} onChange={e => setFormData({...formData, notIncluded: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm font-mono"></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-[#f1f5f9]">
              <button form="planForm" disabled={saving} type="submit" className="w-full py-3 rounded-lg bg-[#0f172a] text-[#CCFF00] font-black text-sm disabled:opacity-50 hover:scale-[1.02] transition-transform">
                {saving ? 'সেভ হচ্ছে...' : 'প্ল্যান সেভ করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
