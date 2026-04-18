'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, ImageIcon, ChevronRight, ChevronLeft, CheckCircle2, BookOpen, DollarSign, Video, FileText, UploadCloud } from 'lucide-react';

const EMPTY = { title: '', description: '', category: '', isFree: false, isActive: true, price: 1500, bannerBase64: '', subscriptionOnly: false, whatYouLearn: [''], modules: [], resources: [] };

const inp = { width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: '#fff', transition: 'border-color 0.15s, box-shadow 0.15s' };
const focus = { borderColor: '#CCFF00', boxShadow: '0 0 0 3px rgba(204,255,0,0.15)' };
const lbl = { fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' };

const STEPS = [
  { id: 0, label: 'মূল তথ্য', icon: BookOpen },
  { id: 1, label: 'মডিউল', icon: Video },
  { id: 2, label: 'রিসোর্স', icon: FileText },
  { id: 3, label: 'মূল্য ও অ্যাক্সেস', icon: DollarSign },
];

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 12, background: checked ? '#CCFF00' : '#e2e8f0', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: checked ? '#0f172a' : '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
    </label>
  );
}

export default function CourseFormFields({ initial = EMPTY, onSave, onCancel, loading }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial, modules: initial.modules || [], whatYouLearn: initial.whatYouLearn || [''], resources: initial.resources || [] });
  const [step, setStep] = useState(0);
  const [focused, setFocused] = useState('');
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(data => {
       const activeCats = Array.isArray(data) ? data : [];
       setCats(activeCats);
       if (!form.category && activeCats.length > 0) {
          setForm(f => ({ ...f, category: activeCats[0].name }));
       }
    });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleBanner = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => set('bannerBase64', ev.target.result); r.readAsDataURL(file);
  };

  const addMod = () => set('modules', [...form.modules, { title: '', youtubeUrl: '', duration: '' }]);
  const setMod = (i, k, v) => { const m = [...form.modules]; m[i] = { ...m[i], [k]: v }; set('modules', m); };
  const delMod = (i) => set('modules', form.modules.filter((_, j) => j !== i));

  const handleResFile = (e, i) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 20000000) return alert('20MB এর বেশি সাইজের ফাইল আপলোড করা যাবে না।');
    const r = new FileReader(); 
    r.onload = ev => {
      const res = [...form.resources];
      res[i] = { ...res[i], fileData: ev.target.result, fileName: file.name };
      set('resources', res);
    }; 
    r.readAsDataURL(file);
  };

  const addRes = () => set('resources', [...form.resources, { title: '', fileData: '', fileName: '' }]);
  const setResTitle = (i, v) => { const r = [...form.resources]; r[i].title = v; set('resources', r); };
  const delRes = (i) => set('resources', form.resources.filter((_, j) => j !== i));

  const inpStyle = (name) => ({ ...inp, ...(focused === name ? focus : {}) });

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, background: '#f8fafc', borderRadius: 12, padding: '12px 16px', gap: 4, overflowX: 'auto' }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: i <= step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#CCFF00' : active ? '#0f172a' : '#e2e8f0', transition: 'all 0.2s', flexShrink: 0 }}>
                  {done ? <CheckCircle2 size={16} style={{ color: '#0f172a' }} /> : <Icon size={15} style={{ color: active ? '#CCFF00' : '#94a3b8' }} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#0f172a' : done ? '#16a34a' : '#94a3b8', whiteSpace: 'nowrap' }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: done ? '#CCFF00' : '#e2e8f0', margin: '0 8px', borderRadius: 2, transition: 'background 0.3s' }} />}
            </div>
          );
        })}
      </div>

      {/* Step 0: Basic Info */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={lbl}>কোর্সের শিরোনাম *</label>
            <input style={inpStyle('title')} value={form.title} onChange={e => set('title', e.target.value)} placeholder="যেমন: পূর্ণাঙ্গ ওয়েব ডেভেলপমেন্ট কোর্স" required onFocus={() => setFocused('title')} onBlur={() => setFocused('')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>ক্যাটাগরি</label>
              <select style={inpStyle('cat')} value={form.category} onChange={e => set('category', e.target.value)} onFocus={() => setFocused('cat')} onBlur={() => setFocused('')}>
                {!cats || cats.length === 0 ? <option value="">লোডিং...</option> : cats?.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>ব্যানার ইমেজ</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1.5px dashed #e2e8f0', borderRadius: 10, cursor: 'pointer', background: '#fafafa', height: 42 }}>
                <ImageIcon size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>ফাইল বাছুন</span>
                <input type="file" accept="image/*" onChange={handleBanner} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          {form.bannerBase64 && <img src={form.bannerBase64} alt="" style={{ height: 100, width: '100%', objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }} />}
          <div>
            <label style={lbl}>বর্ণনা</label>
            <textarea style={{ ...inpStyle('desc'), minHeight: 90, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="কোর্স সম্পর্কে বিস্তারিত লিখুন..." onFocus={() => setFocused('desc')} onBlur={() => setFocused('')} />
          </div>
          <div>
            <label style={lbl}>কি কি শিখবেন (Learning Points)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {form.whatYouLearn?.map((pt, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input style={{ ...inpStyle(`pt${i}`), flex: 1 }} value={pt} onChange={e => { const a = [...(form.whatYouLearn || [])]; a[i] = e.target.value; set('whatYouLearn', a); }} placeholder={`পয়েন্ট ${i + 1}`} onFocus={() => setFocused(`pt${i}`)} onBlur={() => setFocused('')} />
                  {(form.whatYouLearn?.length || 0) > 1 && <button type="button" onClick={() => set('whatYouLearn', form.whatYouLearn?.filter((_, j) => j !== i))} style={{ padding: '0 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer' }}><Trash2 size={12} /></button>}
                </div>
              ))}
              <button type="button" onClick={() => set('whatYouLearn', [...(form.whatYouLearn || []), ''])} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '7px 12px', borderRadius: 8, background: '#f1f5f9', color: '#475569', border: 'none', cursor: 'pointer', width: 'fit-content' }}>
                <Plus size={13} /> পয়েন্ট যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Modules */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: 10 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>ভিডিও মডিউলসমূহ</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>YouTube লিংক দিয়ে প্রতিটি মডিউল তৈরি করুন</p>
            </div>
            <button type="button" onClick={addMod} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 10, background: '#CCFF00', color: '#0f172a', border: 'none', cursor: 'pointer' }}>
              <Plus size={14} /> মডিউল যোগ করুন
            </button>
          </div>
          {(!form.modules || form.modules.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: 12 }}>
              <Video size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ fontSize: 13 }}>কোনো মডিউল নেই। উপরের বাটন চাপুন।</p>
            </div>
          )}
          {form.modules?.map((m, i) => (
            <div key={i} style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: 6 }}>মডিউল {i + 1}</span>
                <button type="button" onClick={() => delMod(i)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 7, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                  <Trash2 size={12} /> মুছুন
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, marginBottom: 8 }}>
                <input style={inpStyle(`mt${i}`)} value={m.title} onChange={e => setMod(i, 'title', e.target.value)} placeholder="মডিউলের নাম" onFocus={() => setFocused(`mt${i}`)} onBlur={() => setFocused('')} />
                <input style={inpStyle(`md${i}`)} value={m.duration} onChange={e => setMod(i, 'duration', e.target.value)} placeholder="যেমন: ২০ মিনিট" onFocus={() => setFocused(`md${i}`)} onBlur={() => setFocused('')} />
              </div>
              <input style={inpStyle(`mu${i}`)} value={m.youtubeUrl} onChange={e => setMod(i, 'youtubeUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." onFocus={() => setFocused(`mu${i}`)} onBlur={() => setFocused('')} />
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Resources */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: 10 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>স্টাডি ম্যাটেরিয়াল (Resources)</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>পিডিএফ, ইমেজ বা সোর্স কোড আপলোড করুন (Max 20MB)</p>
            </div>
            <button type="button" onClick={addRes} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 10, background: '#0f172a', color: '#CCFF00', border: 'none', cursor: 'pointer' }}>
              <Plus size={14} /> ফাইল যোগ করুন
            </button>
          </div>
          {(!form.resources || form.resources.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: 12 }}>
              <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ fontSize: 13 }}>কোনো ম্যাটেরিয়াল নেই। ফাইল যোগ করুন বাটনে চাপুন।</p>
            </div>
          )}
          {form.resources?.map((r, i) => (
            <div key={i} style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                 <input style={{ ...inpStyle(`rt${i}`), flex: 1 }} value={r.title} onChange={e => setResTitle(i, e.target.value)} placeholder="ফাইলের নাম বা শিরোনাম (যেমন: সোর্স কোড পিডিএফ)" onFocus={() => setFocused(`rt${i}`)} onBlur={() => setFocused('')} />
                 <button type="button" onClick={() => delRes(i)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 7, padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Trash2 size={14} />
                 </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', border: '1.5px dashed #e2e8f0', borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: r.fileName ? '#0f172a' : '#94a3b8', fontWeight: r.fileName ? 700 : 500 }} className="truncate max-w-[200px] md:max-w-xs cursor-default">
                  {r.fileName ? r.fileName : 'কোনো ফাইল নির্বাচন করা হয়নি'}
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, padding: '6px 12px', background: '#CCFF00', color: '#0f172a', borderRadius: 6, cursor: 'pointer' }}>
                   <UploadCloud size={14} /> {r.fileName ? 'পরিবর্তন করুন' : 'ফাইল সিলেক্ট করুন'}
                   <input type="file" onChange={(e) => handleResFile(e, i)} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 3: Pricing & Access */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ padding: 20, background: '#f8fafc', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 14, border: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <DollarSign size={14} /> মূল্য নির্ধারণ
            </h4>
            <Toggle checked={form.isFree} onChange={v => set('isFree', v)} label="ফ্রি কোর্স (কোনো মূল্য নেই)" />
            {!form.isFree && (
              <div>
                <label style={lbl}>কোর্সের মূল্য (৳)</label>
                <input style={inpStyle('price')} type="number" value={form.price} onChange={e => set('price', e.target.value)} min="0" onFocus={() => setFocused('price')} onBlur={() => setFocused('')} />
              </div>
            )}
          </div>
          <div style={{ padding: 20, background: '#f8fafc', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 14, border: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} /> অ্যাক্সেস কন্ট্রোল
            </h4>
            <Toggle checked={form.subscriptionOnly} onChange={v => set('subscriptionOnly', v)} label="শুধু সাবস্ক্রাইবারদের জন্য" />
            <Toggle checked={form.isActive} onChange={v => set('isActive', v)} label="পাবলিশড (সকলে দেখতে পাবে)" />
          </div>
          {/* Summary Card */}
          <div style={{ padding: 16, background: form.isFree ? '#dcfce7' : '#dbeafe', borderRadius: 12, border: `1px solid ${form.isFree ? '#bbf7d0' : '#bfdbfe'}` }}>
            <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: form.isFree ? '#15803d' : '#1d4ed8' }}>📋 সারসংক্ষেপ</p>
            <p style={{ fontSize: 13, color: '#374151' }}>কোর্স: <strong>{form.title || 'শিরোনাম দেওয়া হয়নি'}</strong></p>
            <p style={{ fontSize: 13, color: '#374151' }}>মূল্য: <strong>{form.isFree ? 'বিনামূল্যে' : `৳${form.price}`}</strong></p>
            <p style={{ fontSize: 13, color: '#374151' }}>মডিউল: <strong>{form.modules?.length || 0}টি</strong></p>
            <p style={{ fontSize: 13, color: '#374151' }}>রিসোর্স: <strong>{form.resources?.length || 0}টি</strong></p>
            <p style={{ fontSize: 13, color: '#374151' }}>অ্যাক্সেস: <strong>{form.subscriptionOnly ? 'শুধু সাবস্ক্রাইবার' : 'সকলে'}</strong></p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
        {step > 0 && (
          <button type="button" onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <ChevronLeft size={15} /> পেছনে
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.title} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 10, background: (step === 0 && !form.title) ? '#e2e8f0' : '#0f172a', color: (step === 0 && !form.title) ? '#94a3b8' : '#CCFF00', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            পরবর্তী <ChevronRight size={15} />
          </button>
        ) : (
          <button type="button" onClick={() => onSave(form)} disabled={loading || !form.title} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 10, background: '#CCFF00', color: '#0f172a', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> সেভ হচ্ছে...</> : <><Save size={16} /> কোর্স সেভ করুন</>}
          </button>
        )}
        <button type="button" onClick={onCancel} style={{ padding: '10px 18px', borderRadius: 10, background: '#f8fafc', color: '#64748b', fontWeight: 600, fontSize: 13, border: '1px solid #e2e8f0', cursor: 'pointer', fontFamily: 'inherit' }}>বাতিল</button>
      </div>
    </div>
  );
}
