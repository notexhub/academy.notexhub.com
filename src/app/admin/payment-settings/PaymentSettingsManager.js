'use client';
import { useState, useEffect } from 'react';
import { Landmark } from 'lucide-react';

export default function PaymentSettingsManager() {
  const [cfg, setCfg] = useState({ bkashNumber: '', nagadNumber: '', rocketNumber: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d._id) {
        setCfg({ 
          bkashNumber: d.bkashNumber || '',
          nagadNumber: d.nagadNumber || '',
          rocketNumber: d.rocketNumber || '',
        });
      }
      setLoading(false);
    });
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault(); setSaving(true);
    await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) });
    setSaving(false);
    alert('পেমেন্ট নাম্বার আপডেট হয়েছে!');
  };

  if (loading) return <div className="p-8 text-center" style={{ color: '#94a3b8' }}>লোড হচ্ছে...</div>;

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>অর্থপ্রদান সেটিংস</p>
        <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>পেমেন্ট নাম্বার</h2>
      </div>

      <div className="bg-white rounded-2xl border border-[#f1f5f9] p-6 shadow-sm max-w-xl">
        <form onSubmit={saveSettings}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 border-bottom pb-4" style={{borderBottom: '1px solid #f1f5f9'}}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#CCFF00] text-[#0f172a]">
                 <Landmark size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>ম্যানুয়াল পেমেন্ট অপশন</h3>
                <p className="text-xs text-[#64748b]">নাম্বার ফাকা রাখলে সেটি চেকআউটে প্রদর্শিত হবে না</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">বিকাশ পার্সোনাল নাম্বার</label>
                <input type="text" value={cfg.bkashNumber} onChange={e => setCfg({...cfg, bkashNumber: e.target.value})} placeholder="উদাহরন: 01XXXXXXXXX" className="w-full p-3 rounded-lg border border-[#e2e8f0] outline-none focus:border-[#0f172a] text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">নগদ পার্সোনাল নাম্বার</label>
                <input type="text" value={cfg.nagadNumber} onChange={e => setCfg({...cfg, nagadNumber: e.target.value})} placeholder="উদাহরন: 01XXXXXXXXX" className="w-full p-3 rounded-lg border border-[#e2e8f0] outline-none focus:border-[#0f172a] text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">রকেট পার্সোনাল নাম্বার</label>
                <input type="text" value={cfg.rocketNumber} onChange={e => setCfg({...cfg, rocketNumber: e.target.value})} placeholder="উদাহরন: 01XXXXXXXXX" className="w-full p-3 rounded-lg border border-[#e2e8f0] outline-none focus:border-[#0f172a] text-sm font-mono" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f1f5f9]">
            <button type="submit" disabled={saving} className="w-full bg-[#0f172a] text-[#CCFF00] font-black py-3 rounded-xl disabled:opacity-50 tracking-wider hover:scale-105 transition-all">
              {saving ? 'সেভ হচ্ছে...' : 'নাম্বার আপডেট করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
