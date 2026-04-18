'use client';
import { useState, useEffect } from 'react';
import { Users, ToggleLeft, ToggleRight, Shield, CheckCircle2, XCircle } from 'lucide-react';

const sel = { padding: '6px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, background: '#f8fafc', color: '#374151', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' };

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [creating, setCreating] = useState(false);

  const load = () => fetch('/api/admin/users').then(r => r.json()).then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); });
  useEffect(() => { load(); }, []);

  const blockToggle = async (u) => {
    await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u._id, blocked: !u.blocked }) });
    setUsers(us => us.map(x => x._id === u._id ? { ...x, blocked: !x.blocked } : x));
  };

  const changeRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to make this user an ${newRole}?`)) return;
    await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u._id, role: newRole }) });
    setUsers(us => us.map(x => x._id === u._id ? { ...x, role: newRole } : x));
  };

  const assignSub = async (u, plan) => {
    const months = parseInt(plan);
    const expiresAt = months ? new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000) : null;
    await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u._id, subscription: { plan: months ? `${months}month` : 'none', expiresAt } }) });
    load();
  };

  const createAdmin = async (e) => {
    e.preventDefault(); setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      const data = await res.json();
      if (res.ok) {
        setUsers([data.user, ...users]);
        setShowAdminModal(false);
        setNewAdmin({ name: '', email: '', password: '' });
        alert('অ্যাডমিন সফলভাবে তৈরি হয়েছে!');
      } else {
        alert(data.error || 'Failed to create admin');
      }
    } catch {
      alert('Network error');
    }
    setCreating(false);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>অ্যাকাউন্ট ম্যানেজমেন্ট</p>
          <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>ইউজার ম্যানেজমেন্ট</h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>মোট {users.length} জন রেজিস্ট্রার্ড শিক্ষার্থী</p>
        </div>
        <button 
          onClick={() => setShowAdminModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] text-[#CCFF00] text-xs font-bold hover:scale-105 transition-transform"
        >
          <Shield size={14} />
          নতুন অ্যাডমিন তৈরি
        </button>
      </div>

      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#0f172a]">নতুন অ্যাডমিন একাউন্ট</h3>
              <button onClick={() => setShowAdminModal(false)} className="text-[#94a3b8] hover:text-red-500"><XCircle size={20} /></button>
            </div>
            <form onSubmit={createAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">নাম</label>
                <input required type="text" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">ইমেইল</label>
                <input required type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#64748b] mb-1">পাসওয়ার্ড</label>
                <input required type="password" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} className="w-full p-2.5 rounded-lg border border-[#e2e8f0] text-sm" />
              </div>
              <button disabled={creating} type="submit" className="w-full py-3 rounded-lg bg-[#CCFF00] text-[#0f172a] font-black text-sm disabled:opacity-50">
                {creating ? 'তৈরি হচ্ছে...' : 'অ্যাডমিন তৈরি করুন'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['ইউজার', 'রোল', 'সাবস্ক্রিপশন', 'সাবস্ক্রিপশন মেয়াদ', 'ব্লক স্ট্যাটাস'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8', background: '#fafafa' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-16 text-sm" style={{ color: '#94a3b8' }}>লোড হচ্ছে...</td></tr>
            ) : (!users || users.length === 0) ? (
              <tr><td colSpan={5} className="text-center py-16 text-sm" style={{ color: '#94a3b8' }}>কোনো ইউজার পাওয়া যায়নি।</td></tr>
            ) : users?.map(u => {
              const expiry = u.subscription?.expiresAt ? new Date(u.subscription.expiresAt) : null;
              const active = expiry && expiry > new Date();
              return (
                <tr key={u._id} style={{ borderBottom: '1px solid #f8fafc', background: u.blocked ? '#fff5f5' : '' }}
                  onMouseOver={e => { if (!u.blocked) e.currentTarget.style.background = '#fafafa'; }}
                  onMouseOut={e => { e.currentTarget.style.background = u.blocked ? '#fff5f5' : ''; }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: '#0f172a', color: '#CCFF00' }}>{u.name?.[0]?.toUpperCase() || 'U'}</div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>{u.name}</p>
                        <p className="text-xs" style={{ color: '#94a3b8' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit cursor-pointer"
                        title="Click to toggle role"
                        onClick={() => changeRole(u)}
                        style={{ background: u.role === 'admin' ? '#0f172a' : '#f1f5f9', color: u.role === 'admin' ? '#CCFF00' : '#475569' }}>
                        {u.role === 'admin' && <Shield size={11} />} {u.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <select style={sel} defaultValue={u.subscription?.plan?.replace('month', '') || '0'} onChange={e => assignSub(u, e.target.value)}>
                      <option value="0">প্ল্যান নেই</option>
                      <option value="1">১ মাস</option>
                      <option value="2">২ মাস</option>
                      <option value="6">৬ মাস</option>
                      <option value="12">১২ মাস</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    {expiry ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                        style={{ background: active ? '#dcfce7' : '#fee2e2', color: active ? '#15803d' : '#dc2626' }}>
                        {active ? <CheckCircle2 size={11} /> : <XCircle size={11} />} {expiry.toLocaleDateString('bn-BD')}
                      </span>
                    ) : <span className="text-xs" style={{ color: '#cbd5e1' }}>—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => blockToggle(u)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: u.blocked ? '#fee2e2' : '#f1f5f9', color: u.blocked ? '#dc2626' : '#475569', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {u.blocked ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                      {u.blocked ? 'ব্লকড' : 'সক্রিয়'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
