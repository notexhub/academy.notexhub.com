'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Award, Star, LogOut, ChevronRight, PlayCircle,
  Download, CheckCircle, CheckCircle2, XCircle, Loader2, User, Phone, Mail, FileText,
  Lock, TrendingUp, Target, Eye, EyeOff, Save, Rocket
} from 'lucide-react';

export default function DashboardClient({ user, courses, certificates, subscription }) {
  const [activeTab, setActiveTab] = useState('courses');
  const [applying, setApplying] = useState(null);
  const [certs, setCerts] = useState(certificates || []);

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const tabs = [
    { id: 'courses', label: 'আমার কোর্স', icon: BookOpen },
    { id: 'certificates', label: 'সার্টিফিকেট', icon: Award },
    { id: 'subscription', label: 'সাবস্ক্রিপশন', icon: Star },
    { id: 'profile', label: 'প্রোফাইল সেটিংস', icon: User },
  ];

  const stats = [
    { label: 'এনরোল কোর্স', value: courses?.length || 0, icon: BookOpen, color: '#6366f1' },
    { label: 'সম্পন্ন', value: courses?.filter(c => c.pct >= 100)?.length || 0, icon: Target, color: '#10b981' },
    { label: 'সার্টিফিকেট', value: certs?.filter(c => c.status === 'approved')?.length || 0, icon: Award, color: '#f59e0b' },
    { label: 'গড় প্রগ্রেস', value: courses?.length ? `${Math.round(courses.reduce((a, c) => a + c.pct, 0) / courses.length)}%` : '0%', icon: TrendingUp, color: '#CCFF00' },
  ];

  const applyForCert = async (courseId) => {
    setApplying(courseId);
    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseId })
      });
      const data = await res.json();
      if (res.ok) {
        setCerts(prev => [...prev, {
          _id: data._id,
          courseId: courseId,
          courseTitle: courses?.find(c => c._id === courseId)?.title || 'Course',
          status: 'pending',
          requestedAt: new Date().toISOString()
        }]);
        showToast('success', 'আবেদন সফল! অ্যাডমিন অনুমোদনের পর ডাউনলোড করতে পারবেন।');
      } else {
        const msg = data.error || 'একটি সমস্যা হয়েছে।';
        showToast('error', msg);
        window.alert(msg); // fallback so user always sees the error
      }
    } catch (err) {
      const msg = 'Network error হয়েছে বা সার্ভার সম্পর্ক নেই।';
      showToast('error', msg);
      window.alert(msg);
    }
    setApplying(null);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (passwords.newPw && passwords.newPw !== passwords.confirm) {
      showToast('error', 'নতুন পাসওয়ার্ড দুটো মিলছে না।');
      return;
    }
    setSaving(true);
    try {
      const body = { ...profile };
      if (passwords.newPw) {
        body.currentPassword = passwords.current;
        body.newPassword = passwords.newPw;
      }
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'প্রোফাইল সফলভাবে আপডেট হয়েছে!');
        setPasswords({ current: '', newPw: '', confirm: '' });
      } else {
        showToast('error', data.error || 'আপডেট করতে সমস্যা হয়েছে।');
      }
    } catch {
      showToast('error', 'Network error হয়েছে।');
    }
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.72rem 1rem', borderRadius: 12,
    border: '1.5px solid #e2e8f0', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', color: '#0f172a', background: '#f8fafc',
    transition: 'border 0.2s',
  };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-7xl mx-auto px-4 py-8 mb-20 text-[#0f172a]">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999]" style={{
          padding: '14px 20px', borderRadius: 16, fontWeight: 700, fontSize: 14, maxWidth: 360,
          background: toast.type === 'success' ? '#0f172a' : '#fef2f2',
          color: toast.type === 'success' ? '#CCFF00' : '#dc2626',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          border: toast.type === 'success' ? '1px solid rgba(204,255,0,0.2)' : '1px solid #fee2e2',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {toast.type === 'success'
            ? <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            : <XCircle size={18} style={{ flexShrink: 0 }} />}
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="bg-[#0f172a] rounded-[24px] overflow-hidden shadow-2xl relative border border-[#1e293b]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#CCFF00] rounded-full blur-[100px] opacity-10 pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0ea5e9] rounded-full blur-[80px] opacity-10 pointer-events-none -ml-16 -mb-16" />

          {/* Profile Header */}
          <div className="p-8 text-center relative z-10 border-b border-white/5">
            <div className="w-24 h-24 bg-[#CCFF00] text-[#0f172a] text-4xl font-black rounded-full flex items-center justify-center mx-auto mb-4 border-[6px] border-[#1e293b] shadow-lg shadow-[#CCFF00]/10">
              {profile.name?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-white font-black text-xl mb-0.5 tracking-wide">{profile.name}</h2>
            <p className="text-[#94a3b8] text-xs truncate mb-1">{profile.email}</p>
            {profile.phone && <p className="text-[#64748b] text-xs mb-2">📞 {profile.phone}</p>}
            {user?.createdAt && (
              <p className="text-[#334155] text-[10px] font-semibold uppercase tracking-wider mt-2">
                যোগ দিয়েছেন: {new Date(user.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' })}
              </p>
            )}
            {subscription?.active && (
              <div className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/10 text-[#CCFF00] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm mt-3">
                <Star size={12} fill="#CCFF00" /> {subscription.plan} PRO
              </div>
            )}
          </div>

          {/* Stats Pills */}
          <div className="grid grid-cols-2 gap-2 p-4 border-b border-white/5 relative z-10">
            {stats.map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <p className="font-black text-xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] font-semibold text-[#64748b] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Nav */}
          <nav className="p-4 space-y-1 relative z-10">
            {tabs.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group outline-none"
                  style={{ background: isActive ? 'rgba(204,255,0,0.1)' : 'transparent' }}>
                  <div className="flex items-center gap-4">
                    <Icon size={18} className={isActive ? 'text-[#CCFF00]' : 'text-[#64748b] group-hover:text-white transition-colors'} />
                    <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-[#CCFF00]' : 'text-[#94a3b8] group-hover:text-white transition-colors'}`}>{t.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.8)]" />}
                </button>
              );
            })}
            <div className="h-px bg-white/5 my-2 mx-4" />
            <Link href="/api/auth/logout" className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-[#ef4444] hover:bg-white/5 transition-colors group outline-none">
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-bold tracking-wide">লগ আউট</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#e2e8f0]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-1">ওভারভিউ</p>
            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
        </div>

        {/* === COURSES TAB === */}
        {activeTab === 'courses' && (
          <div>
            {!courses || courses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#e2e8f0] p-16 text-center shadow-sm">
                <div className="w-24 h-24 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen size={40} className="text-[#cbd5e1]" />
                </div>
                <h3 className="text-xl font-black text-[#0f172a] mb-2">কোনো কোর্স নেই</h3>
                <p className="text-[#64748b] text-sm mb-8 max-w-md mx-auto">আপনি এখনো কোনো কোর্সে এনরোল করেননি।</p>
                <Link href="/courses" className="bg-[#0f172a] text-[#CCFF00] px-8 py-3.5 rounded-xl font-black text-sm hover:bg-[#1e293b] transition-colors inline-flex items-center gap-2 shadow-lg">
                  কোর্স ব্রাউজ করুন <ChevronRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses?.map(c => {
                  const appliedCert = certs?.find(cert => String(cert.courseId) === String(c._id));
                  return (
                    <div key={c._id} className="bg-white rounded-3xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                      <div className="h-44 bg-[#f1f5f9] relative overflow-hidden">
                        {c.bannerBase64 ? (
                          <img src={c.bannerBase64} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
                            <PlayCircle size={40} className="text-[#CCFF00] opacity-30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <span className="text-white font-bold text-sm">প্রগ্রেস</span>
                          <span className="bg-[#CCFF00] px-3 py-1 rounded-full text-[11px] font-black text-[#0f172a]">{c.pct}%</span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-[#0f172a] font-black text-lg leading-snug mb-5 tracking-tight line-clamp-2">{c.title}</h3>
                        <div className="mt-auto space-y-4">
                          <div>
                            <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden mb-2">
                              <div className="bg-[#0f172a] h-full rounded-full transition-all duration-1000" style={{ width: `${c.pct}%` }} />
                            </div>
                            <p className="text-[11px] font-bold text-[#64748b] text-right">{c.completedModules?.length || 0} / {c.totalModules || 0} মডিউল</p>
                          </div>

                          <div className="flex flex-col gap-3">
                            <Link href={`/learn/${c._id}`} className="w-full text-center bg-[#CCFF00] text-[#0f172a] px-4 py-3 rounded-xl text-sm font-black hover:bg-[#bbf700] transition-colors outline-none flex items-center justify-center gap-2">
                              {c.pct > 0 ? 'চালিয়ে যান' : 'শুরু করুন'} <PlayCircle size={16} />
                            </Link>

                            {c.pct >= 80 && !appliedCert && (
                              <button onClick={() => applyForCert(c._id)} disabled={applying === c._id} className="w-full flex items-center justify-center gap-2 bg-[#0f172a] text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-[#1e293b] transition-colors disabled:opacity-70">
                                {applying === c._id ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} className="text-[#CCFF00]" />}
                                সার্টিফিকেট আবেদন করুন
                              </button>
                            )}

                            {appliedCert && (
                              <div className="w-full flex items-center justify-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] px-4 py-3 rounded-xl text-sm font-bold">
                                {appliedCert.status === 'approved' ? <CheckCircle size={16} className="text-[#10b981]" /> : <Award size={16} className="text-[#f59e0b]" />}
                                {appliedCert.status === 'approved' ? 'সার্টিফিকেট অনুমোদিত' : appliedCert.status === 'rejected' ? 'আবেদন বাতিল হয়েছে' : 'আবেদনটি পেন্ডিং আছে'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* === CERTIFICATES TAB === */}
        {activeTab === 'certificates' && (
          <div>
            {!certs || certs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#e2e8f0] p-16 text-center shadow-sm">
                <div className="w-24 h-24 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award size={40} className="text-[#cbd5e1]" />
                </div>
                <h3 className="text-xl font-black text-[#0f172a] mb-2">কোনো সার্টিফিকেট নেই</h3>
                <p className="text-[#64748b] text-sm max-w-sm mx-auto">কোর্স সম্পন্ন করে আপনার প্রথম সার্টিফিকেট অর্জন করুন।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {certs?.map(c => (
                  <div key={c._id} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm hover:border-[#cbd5e1] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl flex items-center justify-center shrink-0">
                        <Award size={26} className={c.status === 'approved' ? 'text-[#10b981]' : c.status === 'rejected' ? 'text-[#ef4444]' : 'text-[#f59e0b]'} />
                      </div>
                      <div>
                        <h4 className="text-[#0f172a] font-black text-base mb-1 tracking-tight">{c.courseTitle}</h4>
                        <p className="text-[#64748b] text-xs font-semibold">অনুরোধ: {new Date(c.requestedAt).toLocaleDateString('bn-BD')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${c.status === 'approved' ? 'bg-[#dcfce7] text-[#15803d]' : c.status === 'rejected' ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#fef9c3] text-[#a16207]'}`}>
                        {c.status === 'approved' ? 'অনুমোদিত' : c.status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'}
                      </span>
                      {c.status === 'approved' ? (
                        <a href={`/certificate/${c._id}`} target="_blank" className="flex items-center gap-2 text-sm font-bold bg-[#0f172a] text-[#CCFF00] px-5 py-2.5 rounded-lg hover:bg-[#1e293b] transition-colors">
                          <Download size={16} /> ডাউনলোড
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-[#94a3b8] bg-[#f1f5f9] px-4 py-2.5 rounded-lg">রিভিউ চলছে</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === SUBSCRIPTION TAB === */}
        {activeTab === 'subscription' && (
          <div className="bg-[#0f172a] rounded-[24px] p-8 shadow-xl max-w-xl relative overflow-hidden border border-[#1e293b]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCFF00] rounded-full blur-[100px] opacity-10 pointer-events-none -mr-32 -mt-32" />
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className="w-16 h-16 bg-[#CCFF00] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#CCFF00]/20">
                <Star size={32} fill="#0f172a" className="text-[#0f172a]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1">বর্তমান প্ল্যান</h3>
                {subscription?.active
                  ? <p className="text-[#CCFF00] font-bold text-sm tracking-widest uppercase">ACTIVE EXCLUSIVE</p>
                  : <p className="text-[#64748b] font-bold text-sm tracking-widest uppercase">INACTIVE NO PLAN</p>
                }
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 relative z-10 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-[#94a3b8] text-sm font-bold">প্যাকেজ</span>
                <span className="text-white font-black text-lg">{subscription?.plan || 'Free Account'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94a3b8] text-sm font-bold">মেয়াদ উত্তীর্ণ</span>
                <span className="text-white font-black">
                  {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
            <Link href="/pricing" className="flex items-center justify-center gap-3 w-full text-center bg-[#CCFF00] text-[#0f172a] py-4 rounded-xl font-black text-lg hover:bg-white transition-colors relative z-10 shadow-xl">
              {subscription?.active ? <><Rocket size={20} /> প্ল্যান রিনিউ করুন</> : <><Star size={20} fill="#0f172a" /> প্রিমিয়াম প্ল্যান কিনুন</>}
            </Link>
          </div>
        )}

        {/* === PROFILE SETTINGS TAB === */}
        {activeTab === 'profile' && (
          <form onSubmit={saveProfile} className="space-y-6 max-w-2xl">
            {/* Basic Info Card */}
            <div className="bg-white rounded-3xl border border-[#e2e8f0] p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#0f172a] mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#f1f5f9] rounded-lg flex items-center justify-center">
                  <User size={16} className="text-[#64748b]" />
                </div>
                ব্যক্তিগত তথ্য
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label style={labelStyle}>পুরো নাম</label>
                  <input
                    style={inputStyle} value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="আপনার নাম" required
                  />
                </div>
                <div>
                  <label style={labelStyle}>ইমেইল</label>
                  <div className="relative">
                    <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      style={{ ...inputStyle, paddingLeft: '2.5rem' }} type="email" value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                      placeholder="your@email.com" required
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>ফোন নম্বর</label>
                  <div className="relative">
                    <Phone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      style={{ ...inputStyle, paddingLeft: '2.5rem' }} value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+880 1X XXXX-XXXX"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>নিজের সম্পর্কে (Bio)</label>
                  <div className="relative">
                    <FileText size={15} style={{ position: 'absolute', left: 14, top: 16, color: '#94a3b8' }} />
                    <textarea
                      style={{ ...inputStyle, paddingLeft: '2.5rem', minHeight: 100, resize: 'vertical' }}
                      value={profile.bio}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Card */}
            <div className="bg-white rounded-3xl border border-[#e2e8f0] p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#0f172a] mb-2 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#fef2f2] rounded-lg flex items-center justify-center">
                  <Lock size={16} className="text-[#ef4444]" />
                </div>
                পাসওয়ার্ড পরিবর্তন
              </h3>
              <p className="text-xs text-[#94a3b8] mb-6 font-medium">পাসওয়ার্ড পরিবর্তন না করতে চাইলে এই ঘরগুলো ফাঁকা রাখুন।</p>

              <div className="grid grid-cols-1 gap-5">
                {[
                  { key: 'current', label: 'বর্তমান পাসওয়ার্ড', placeholder: 'বর্তমান পাসওয়ার্ড দিন' },
                  { key: 'newPw', label: 'নতুন পাসওয়ার্ড', placeholder: 'নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' },
                  { key: 'confirm', label: 'পাসওয়ার্ড নিশ্চিত করুন', placeholder: 'আবার টাইপ করুন' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <div className="relative">
                      <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        style={{ ...inputStyle, paddingLeft: '2.5rem', paddingRight: '3rem' }}
                        type={showPw[f.key] ? 'text' : 'password'}
                        value={passwords[f.key]}
                        onChange={e => setPasswords({ ...passwords, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                      />
                      <button type="button" onClick={() => setShowPw(s => ({ ...s, [f.key]: !s[f.key] }))}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        {showPw[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-3 bg-[#0f172a] text-[#CCFF00] py-4 rounded-2xl font-black text-lg hover:bg-[#1e293b] transition-colors disabled:opacity-70 shadow-xl">
              {saving ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} />}
              {saving ? 'সেভ হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
