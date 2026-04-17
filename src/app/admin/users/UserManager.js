'use client';
import { useState, useEffect } from 'react';

export default function AdminUserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => { setUsers(d); setLoading(false); });
  }, []);

  const block = async (id, blocked) => {
    await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, blocked: !blocked }) });
    setUsers(u => u.map(x => x._id === id ? {...x, blocked: !x.blocked} : x));
  };

  const assignSub = async (id, plan) => {
    const months = parseInt(plan) || 1;
    const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);
    await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, subscription: { plan: `${months}month`, expiresAt } }) });
    setUsers(u => u.map(x => x._id === id ? {...x, subscription: { plan: `${months}month`, expiresAt }} : x));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>লোড হচ্ছে...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>ইউজার ম্যানেজমেন্ট</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>মোট {users.length} জন রেজিস্ট্রার্ড</p>
      </div>
      <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
        <table className="table">
          <thead>
            <tr>
              <th>নাম / ইমেইল</th>
              <th>রোল</th>
              <th>সাবস্ক্রিপশন</th>
              <th>এক্সপায়ার</th>
              <th>স্ট্যাটাস</th>
              <th>কাজ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar avatar-sm">{u.name?.[0] || 'U'}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{u.name}</p>
                      <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-xs)' }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-navy' : 'badge-gray'}`}>{u.role}</span></td>
                <td>
                  <select className="form-select" style={{ width: 130, padding: '0.3rem 0.5rem', fontSize: 'var(--text-xs)' }} defaultValue={u.subscription?.plan?.replace('month', '') || '0'} onChange={e => e.target.value !== '0' && assignSub(u._id, e.target.value)}>
                    <option value="0">কোনো প্ল্যান নেই</option>
                    <option value="1">১ মাস</option>
                    <option value="2">২ মাস</option>
                    <option value="6">৬ মাস</option>
                    <option value="12">১২ মাস</option>
                  </select>
                </td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                  {u.subscription?.expiresAt ? new Date(u.subscription.expiresAt).toLocaleDateString('bn-BD') : '—'}
                </td>
                <td><span className={`badge ${u.blocked ? 'badge-red' : 'badge-green'}`}>{u.blocked ? 'ব্লকড' : 'সক্রিয়'}</span></td>
                <td>
                  <button onClick={() => block(u._id, u.blocked)} className={`btn btn-sm ${u.blocked ? 'btn-lime' : 'btn-outline'}`} style={{ color: u.blocked ? 'var(--navy)' : 'var(--red)', borderColor: u.blocked ? undefined : 'var(--red)' }}>
                    {u.blocked ? 'আনব্লক' : 'ব্লক'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
