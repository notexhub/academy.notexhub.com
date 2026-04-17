'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function PartnerManager() {
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState({ companyName: '', logoBase64: '' });

  useEffect(() => { fetch('/api/admin/partners').then(r => r.json()).then(setPartners); }, []);

  const upload = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/partners', { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) {
      const np = await res.json();
      setPartners([np, ...partners]);
      setForm({ companyName: '', logoBase64: '' });
    }
  };

  const remove = async (id) => {
    const res = await fetch('/api/admin/partners', { method: 'DELETE', body: JSON.stringify({ id }) });
    if (res.ok) setPartners(partners.filter(p => p._id !== id));
  };

  return (
    <div>
      <Card style={{ marginBottom: '2rem' }}>
        <h3>গ্রাজুয়েট কোম্পানি লোগো যোগ করুন</h3>
        <form onSubmit={upload} style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <Input label="কোম্পানির নাম" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} style={{ flex: 1 }} required />
          <Input label="লোগো URL/Base64" value={form.logoBase64} onChange={e => setForm({...form, logoBase64: e.target.value})} style={{ flex: 1 }} required />
          <Button type="submit" style={{ height: '45px', marginBottom: '1.2rem' }}>যোগ করুন</Button>
        </form>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {partners.map(p => (
          <Card key={p._id} style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem' }}>{p.companyName}</h4>
            <Button variant="secondary" onClick={() => remove(p._id)}>Remove</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
