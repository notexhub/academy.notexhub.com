'use client';
import { useState, useEffect } from 'react';
import { Settings, Image as ImageIcon } from 'lucide-react';

export default function SettingsManager() {
  const [cfg, setCfg] = useState({ websiteLogoBase64: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d._id) { setCfg({ websiteLogoBase64: d.websiteLogoBase64 || '' }); }
      setLoading(false);
    });
  }, []);

  const fileUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); 
    r.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let w = img.width, h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) { h = Math.round((h * MAX_DIM) / w); w = MAX_DIM; }
          else { w = Math.round((w * MAX_DIM) / h); h = MAX_DIM; }
        }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/png', 0.8);
        setCfg({ ...cfg, websiteLogoBase64: dataUrl });
      };
      img.src = ev.target.result;
    }; 
    r.readAsDataURL(file);
  };

  const saveSettings = async (e) => {
    e.preventDefault(); setSaving(true);
    await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) });
    setSaving(false);
    alert('সেটিংস আপডেট হয়েছে!');
    window.location.reload();
  };

  if (loading) return <div className="p-8 text-center" style={{ color: '#94a3b8' }}>লোড হচ্ছে...</div>;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>গ্লোবাল কনফিগারেশন</p>
        <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>ওয়েবসাইট সেটিংস</h2>
      </div>
      <div className="bg-white rounded-2xl border border-[#f1f5f9] p-6 shadow-sm max-w-xl">
        <form onSubmit={saveSettings}>
          <div className="mb-6">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>ব্র্যান্ডিং</h3>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 8 }}>ওয়েবসাইটের লোগো</label>
            <p className="text-xs mb-4" style={{ color: '#64748b' }}>এই লোগোটি ওয়েবসাইটের নেভিগেশন বার এবং অন্যান্য গ্লোবাল অংশে প্রদর্শিত হবে।</p>
            <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] flex flex-col items-center">
              <div className="h-16 flex items-center justify-center mb-4">
                 {cfg.websiteLogoBase64 ? (
                   <img src={cfg.websiteLogoBase64} className="max-h-full max-w-full object-contain drop-shadow" alt="Logo preview" />
                 ) : (
                   <div className="text-center px-4 py-2 border-2 border-dashed border-[#cbd5e1] rounded-lg">
                      <ImageIcon size={24} className="mx-auto mb-1 text-[#cbd5e1]" />
                      <span className="text-[#94a3b8] text-xs font-bold">লোগো নেই</span>
                   </div>
                 )}
              </div>
              <label className="bg-[#0f172a] text-[#CCFF00] py-2 px-6 rounded-lg text-xs font-bold cursor-pointer hover:scale-105 transition-transform block">
                লোগো আপলোড করুন <input type="file" accept="image/*" onChange={fileUpload} className="hidden" />
              </label>
              {cfg.websiteLogoBase64 && (
                 <button type="button" onClick={() => setCfg({...cfg, websiteLogoBase64: ''})} className="mt-2 text-xs font-bold text-red-500 hover:underline">রিমুভ করুন</button>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-[#f1f5f9]">
            <button type="submit" disabled={saving} className="w-full bg-[#CCFF00] text-[#0f172a] font-black py-3 rounded-xl disabled:opacity-50 tracking-wider">
              {saving ? 'সেভ হচ্ছে...' : 'সেটিংস আপডেট করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
