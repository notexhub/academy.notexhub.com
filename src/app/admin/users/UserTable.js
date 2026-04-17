'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function UserTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);

  const toggleBlock = async (id, currentStatus) => {
    const res = await fetch('/api/admin/users', { method: 'PUT', body: JSON.stringify({ id, blocked: !currentStatus }) });
    if (res.ok) setUsers(users.map(u => u._id === id ? { ...u, blocked: !currentStatus } : u));
  };

  const setSub = async (id, plan) => {
    const res = await fetch('/api/admin/users', { method: 'PUT', body: JSON.stringify({ id, plan }) });
    if (res.ok) setUsers(users.map(u => u._id === id ? { ...u, subscription: { plan } } : u));
  };

  return (
    <Card style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--gray)' }}>
            <th style={{ padding: '1rem' }}>Name</th>
            <th>Email</th>
            <th>Sub Access</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{ borderBottom: '1px solid var(--gray)' }}>
              <td style={{ padding: '1rem' }}>{u.name}</td>
              <td>{u.email}</td>
              <td>
                 <select value={u.subscription?.plan || 'none'} onChange={(e) => setSub(u._id, e.target.value)} style={{ padding: '0.5rem', borderRadius:'4px' }}>
                   <option value="none">None</option>
                   <option value="1-month">1 Month Tracker</option>
                   <option value="2-month">2 Month Tracker</option>
                 </select>
              </td>
              <td>
                <Button variant={u.blocked ? "primary" : "secondary"} onClick={() => toggleBlock(u._id, u.blocked)} style={{ padding: '0.4rem 0.8rem' }}>
                  {u.blocked ? 'Unblock' : 'Block'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
