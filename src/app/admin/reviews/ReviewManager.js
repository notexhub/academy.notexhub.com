'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ studentName: '', role: '', quote: '', photoBase64: '' });

  useEffect(() => { fetch('/api/admin/reviews').then(r => r.json()).then(setReviews); }, []);

  const upload = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/reviews', { method: 'POST', body: JSON.stringify(form) });
    if (res.ok) {
      const nr = await res.json();
      setReviews([nr, ...reviews]);
      setForm({ studentName: '', role: '', quote: '', photoBase64: '' });
    }
  };

  const remove = async (id) => {
    if (confirm('Delete this review?')) {
      const res = await fetch('/api/admin/reviews', { method: 'DELETE', body: JSON.stringify({ id }) });
      if (res.ok) setReviews(reviews.filter(r => r._id !== id));
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: '2rem' }}>
        <h3>নতুন রিভিউ যোগ করুন</h3>
        <form onSubmit={upload} style={{ marginTop: '1.5rem' }}>
          <Input label="ছাত্রের নাম" value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} required />
          <Input label="রোল (e.g. Web Developer)" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required />
          <textarea placeholder="রিভিউ বর্ণনা..." value={form.quote} onChange={e => setForm({...form, quote: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }} required />
          <Button type="submit">রিভিউ সেভ করুন</Button>
        </form>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {reviews.map(r => (
          <Card key={r._id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4>{r.studentName}</h4>
              <p style={{ color: 'var(--brand-lime)', fontWeight: 'bold', fontSize: '0.8rem' }}>{r.role}</p>
              <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>"{r.quote}"</p>
            </div>
            <Button variant="secondary" onClick={() => remove(r._id)} style={{ marginTop: '1.5rem' }}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
