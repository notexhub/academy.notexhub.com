'use client';
import { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, Download, Eye, Settings, FileImageIcon } from 'lucide-react';

const STATUS_COLORS = {
  pending: { bg: '#fef9c3', color: '#a16207', label: 'পেন্ডিং' },
  approved: { bg: '#dcfce7', color: '#15803d', label: 'অনুমোদিত' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'বাতিল' },
};

const inp = { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: '#fff' };
const lbl = { fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 };

export default function CertificateManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); 
  const [filter, setFilter] = useState('all');
  
  const [cfg, setCfg] = useState({ logoBase64: '', sealBase64: '', isoSealBase64: '', signatureBase64: '', watermarkBase64: '', authorizedByName: 'NotexHub Admin', authorizedByRole: 'Authorized Signature', issueDateText: 'Date of Issue' });
  const [savingSettings, setSavingSettings] = useState(false);

  const [previewUser, setPreviewUser] = useState('Md. Rakib');
  const [previewCourse, setPreviewCourse] = useState('Full Stack Web Development');

  useEffect(() => {
    fetch('/api/admin/certificates?all=true').then(r => r.json()).then(d => { setCerts(Array.isArray(d) ? d : []); setLoading(false); });
    fetch('/api/admin/settings').then(r => r.json()).then(d => { if(d._id) setCfg(cfg => ({...cfg, ...d})); });
  }, []);

  const act = async (id, status) => {
    await fetch('/api/admin/certificates', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setCerts(prev => prev.map(c => c._id === id ? { ...c, status } : c));
  };

  const saveSettings = async (e) => {
    e.preventDefault(); setSavingSettings(true);
    try {
      const resp = await fetch('/api/admin/settings', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(cfg) 
      });
      if (resp.ok) {
        alert('সার্টিফিকেট সেটিংস সফলভাবে সেভ হয়েছে!');
      } else {
        const err = await resp.json();
        alert('সেভ করতে সমস্যা হয়েছে: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা হয়েছে: ' + err.message);
    }
    setSavingSettings(false);
  };

  const fileUpload = (e, key) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); 
    r.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600; // Lowered from 800 for even better reliability
        let w = img.width, h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) { h = Math.round((h * MAX_DIM) / w); w = MAX_DIM; }
          else { w = Math.round((w * MAX_DIM) / h); h = MAX_DIM; }
        }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/png', 0.8);
        setCfg(p => ({ ...p, [key]: dataUrl }));
      };
      img.src = ev.target.result;
    }; 
    r.readAsDataURL(file);
  };

  const filtered = filter === 'all' ? certs : certs.filter(c => c.status === filter);
  const counts = { all: certs.length, pending: certs.filter(c => c.status === 'pending').length, approved: certs.filter(c => c.status === 'approved').length, rejected: certs.filter(c => c.status === 'rejected').length };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>অনুমোদন ও টেমপ্লেট</p>
          <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>সার্টিফিকেট ম্যানেজমেন্ট</h2>
        </div>
        <div className="bg-[#f1f5f9] p-1 rounded-xl flex gap-1">
          <button onClick={() => setActiveTab('requests')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'requests' ? 'bg-[#0f172a] text-[#CCFF00] shadow' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
            <Award size={16} /> রিকোয়েস্টসমূহ
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-[#0f172a] text-[#CCFF00] shadow' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
            <Settings size={16} /> ডিজাইন সেটিংস
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_550px] gap-8">
          <div className="bg-white rounded-2xl border border-[#f1f5f9] p-6 shadow-sm">
            <h3 className="font-bold text-lg text-[#0f172a] mb-6 border-b border-[#f1f5f9] pb-4">টেমপ্লেট কাস্টমাইজেশন</h3>
            <form onSubmit={saveSettings} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={lbl}>অথোরাইজড ব্যক্তির নাম</label>
                  <input style={inp} value={cfg.authorizedByName} onChange={e => setCfg({...cfg, authorizedByName: e.target.value})} placeholder="যেমন: Md. Rakib" />
                </div>
                <div>
                  <label style={lbl}>পদবী (Role)</label>
                  <input style={inp} value={cfg.authorizedByRole} onChange={e => setCfg({...cfg, authorizedByRole: e.target.value})} placeholder="যেমন: CEO, NotexHub" />
                </div>
              </div>

              <div>
                <label style={lbl}>ইস্যু তারিখের লেবেল</label>
                <input style={inp} value={cfg.issueDateText} onChange={e => setCfg({...cfg, issueDateText: e.target.value})} placeholder="যেমন: Date of Issue / Issue Date" />
              </div>

              {/* Uploads Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { key: 'logoBase64', label: 'Company Logo', def: 'লোগো' },
                  { key: 'isoSealBase64', label: 'ISO Seal', def: 'ISO সিল' },
                  { key: 'signatureBase64', label: 'Signature', def: 'স্বাক্ষর' },
                  { key: 'sealBase64', label: 'Company Seal', def: 'আসল সিল' },
                  { key: 'watermarkBase64', label: 'Watermark', def: 'জলছাপ' }
                ].map(item => (
                  <div key={item.key} className="p-3 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] text-center">
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>{item.label}</label>
                    <div className="h-10 flex items-center justify-center mb-2">
                       {cfg[item.key] ? <img src={cfg[item.key]} className="max-h-full max-w-full object-contain" /> : <span className="text-[#cbd5e1] text-[10px] font-bold">{item.def}</span>}
                    </div>
                    <label className="bg-white border border-[#e2e8f0] py-1.5 px-3 rounded text-[9px] font-bold text-[#0f172a] cursor-pointer hover:bg-[#f1f5f9] transition-colors block">
                      আপলোড <input type="file" accept="image/*" onChange={(e) => fileUpload(e, item.key)} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#f1f5f9]">
                <button type="submit" disabled={savingSettings} className="w-full bg-[#0f172a] text-[#CCFF00] font-black py-3 rounded-xl disabled:opacity-50 tracking-wider">
                  {savingSettings ? 'সেভ হচ্ছে...' : 'SAVE SETTINGS'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview (Miniature Premium Layout) */}
          <div className="bg-[#e2e8f0] p-6 rounded-2xl flex items-center justify-center relative overflow-hidden h-full min-h-[400px]">
             <div className="w-[500px] bg-white relative shadow-2xl p-[12px] border-[14px] border-[#f58220]" style={{ aspectRatio: '1.414/1' }}>
                <div className="absolute top-0 left-[8%] right-[8%] h-[12px] bg-[#004b87] z-10 mx-[-12px]"></div>
                <div className="absolute bottom-0 left-[8%] right-[8%] h-[12px] bg-[#004b87] z-10 mx-[-12px]"></div>
                
                <div className="w-full h-full border-[2px] border-[#cbd5e1] p-0.5 relative z-10 bg-white">
                  <div className="w-full h-full border-[3px] border-[#e2e8f0] p-2 flex flex-col items-center flex-1 justify-between bg-white relative overflow-hidden">
                      
                      {cfg.watermarkBase64 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none z-0">
                          <img src={cfg.watermarkBase64} className="max-w-[70%] max-h-[70%] object-contain mix-blend-multiply" alt="Watermark" />
                        </div>
                      )}

                      <div className="flex justify-between items-start w-full relative mb-1 h-10 z-20">
                        {cfg.isoSealBase64 ? (
                          <img src={cfg.isoSealBase64} className="w-10 h-10 object-contain absolute left-0 top-0" />
                        ) : (
                          <div className="w-10 h-10 border-2 border-[#004b87] rounded-full flex items-center justify-center absolute left-0 top-0 bg-white z-20">
                             <span className="text-[6px] font-bold text-[#004b87] text-center leading-tight">ISO<br/>9001</span>
                          </div>
                        )}
                        <div className="w-full flex justify-center h-full items-center">
                           {cfg.logoBase64 ? <img src={cfg.logoBase64} className="h-full object-contain" /> : <div className="text-[#004b87] font-black text-xs tracking-tighter">NOTEX<span className="text-[#f58220]">HUB</span></div>}
                        </div>
                      </div>
                      
                      <div className="text-center mt-1 w-full relative z-20 flex-1">
                        <h1 className="text-[1.3rem] text-[#333] mb-1" style={{fontFamily: "'Old English Text MT', 'UnifrakturMaguntia', serif", fontWeight: 'normal'}}>Certificate of Achievement</h1>
                        <p className="text-[6px] text-[#333] mb-1 uppercase tracking-widest font-serif">This is to certify that</p>
                        
                        <div className="flex items-center justify-center gap-2 mb-1 border-b border-[#cbd5e1] mx-[20%] pb-0.5">
                           <div className="w-0 h-0 border-y-[3px] border-y-transparent border-r-[4px] border-r-[#f58220]"></div>
                           <h2 className="text-[#004b87] text-xs font-black uppercase font-sans tracking-wide">{previewUser}</h2>
                           <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[4px] border-l-[#f58220]"></div>
                        </div>
                        
                        <p className="text-[5px] text-[#555] mb-1 font-serif uppercase tracking-widest mt-1">has successfully completed</p>
                        <h3 className="text-[#004b87] text-[7px] font-black uppercase mb-1 font-sans tracking-wider">{previewCourse}</h3>
                        
                        <p className="text-[5px] text-[#333] font-bold font-serif mb-0.5 mt-2 capitalize">{cfg.issueDateText}</p>
                        <p className="text-[#004b87] text-[6px] font-black font-sans uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>

                      <div className="w-full flex justify-between items-end mt-1 px-4 pb-2 z-20">
                        <div className="text-left w-1/3">
                          <p className="text-[4px] font-bold text-[#333] mb-2 font-sans tracking-wider">Certificate ID : <span className="font-normal">APX1234567</span></p>
                          {cfg.sealBase64 && <img src={cfg.sealBase64} className="h-8 w-8 object-contain" alt="Seal" />}
                        </div>
                        <div className="text-center w-1/3 flex flex-col items-center">
                           <div className="border-b-[0.5px] border-[#94a3b8] pb-0.5 h-6 flex items-end justify-center w-[80px]">
                             {cfg.signatureBase64 ? <img src={cfg.signatureBase64} className="h-[120%] object-contain" /> : <span className="text-[6px] text-[#333] italic" style={{fontFamily: "'Great Vibes', cursive"}}>{cfg.authorizedByName}</span>}
                           </div>
                           <p className="text-[#004b87] text-[4px] font-black uppercase mt-1 tracking-widest font-sans">{cfg.authorizedByRole}</p>
                        </div>
                      </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <>
          <div className="flex gap-2 mb-4">
            {[['all', 'সকল', counts.all], ['pending', 'পেন্ডিং', counts.pending], ['approved', 'অনুমোদিত', counts.approved], ['rejected', 'বাতিল', counts.rejected]].map(([val, label, count]) => (
              <button key={val} onClick={() => setFilter(val)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === val ? 'bg-[#0f172a] text-[#CCFF00]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
                {label} <span className={`text-[10px] px-1.5 rounded-full ${filter === val ? 'bg-[#1e293b] text-[#CCFF00]' : 'bg-[#e2e8f0] text-[#64748b]'}`}>{count}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden bg-white border border-[#f1f5f9] shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {['শিক্ষার্থী', 'কোর্স', 'তারিখ', 'স্ট্যাটাস', 'অ্যাকশন'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#94a3b8] bg-[#fafafa]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={5} className="text-center py-12 text-sm text-[#94a3b8]">লোড হচ্ছে...</td></tr>
                : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-[#94a3b8]">
                    <Award size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">কোনো রেকর্ড নেই</p>
                  </td></tr>
                ) : filtered.map(c => {
                  const sc = STATUS_COLORS[c.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={c._id} className="border-b border-[#f8fafc] hover:bg-[#fafafa]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0f172a] text-[#CCFF00] flex flex-shrink-0 items-center justify-center font-bold text-xs">{c.user?.[0] || '?'}</div>
                          <div>
                            <p className="font-semibold text-sm text-[#0f172a]">{c.user || 'Unknown'}</p>
                            <p className="text-xs text-[#94a3b8]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><span className="text-sm font-medium text-[#374151]">{c.course}</span></td>
                      <td className="px-5 py-3"><span className="text-xs text-[#94a3b8]">{c.requestedAt ? new Date(c.requestedAt).toLocaleDateString('bn-BD') : '—'}</span></td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          {c.status === 'pending' && <>
                            <button onClick={() => act(c._id, 'approved')} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0]"><CheckCircle size={12} /> অনুমোদন</button>
                            <button onClick={() => act(c._id, 'rejected')} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]"><XCircle size={12} /> বাতিল</button>
                          </>}
                          {c.status === 'approved' && <>
                            <a href={`/certificate/${c._id}`} target="_blank" className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#0f172a] text-[#CCFF00] hover:bg-[#1e293b]"><Eye size={12} /> দেখুন</a>
                            <button onClick={() => act(c._id, 'rejected')} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]">Revoke</button>
                          </>}
                          {c.status === 'rejected' && <button onClick={() => act(c._id, 'pending')} className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]">পুনরুদ্ধার</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
