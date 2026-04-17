'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CertificateManager({ initialCerts }) {
  const [certs, setCerts] = useState(initialCerts);

  const approve = async (id) => {
    const res = await fetch('/api/admin/certificates', { method: 'PUT', body: JSON.stringify({ id, status: 'approved' }) });
    if (res.ok) setCerts(certs.filter(c => c._id !== id));
  };

  const reject = async (id) => {
    const res = await fetch('/api/admin/certificates', { method: 'PUT', body: JSON.stringify({ id, status: 'rejected' }) });
    if (res.ok) setCerts(certs.filter(c => c._id !== id));
  };

  return (
    <Card>
      {certs.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem' }}>কোনো পেন্ডিং সার্টিফিকেট নেই।</p> : (
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--gray)' }}>
              <th style={{ padding: '1rem' }}>User</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {certs.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid var(--gray)' }}>
                <td style={{ padding: '1rem' }}>{c.user} <br/><small style={{ color: 'var(--black-light)' }}>{c.email}</small></td>
                <td>{c.course}</td>
                <td style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '100%', padding: '1rem' }}>
                  <Button onClick={() => approve(c._id)} style={{ padding: '0.4rem 0.8rem' }}>অনুমোদন</Button>
                  <Button variant="secondary" onClick={() => reject(c._id)} style={{ padding: '0.4rem 0.8rem' }}>বাতিল</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
