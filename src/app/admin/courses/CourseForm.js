'use client';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CourseForm() {
  const [course, setCourse] = useState({ title: '', desc: '', isFree: false, banner: '', modules: [] });

  const addModule = () => setCourse({ ...course, modules: [...course.modules, { title: '', youtubeUrl: '', duration: '' }] });
  
  const handleModChange = (i, field, val) => {
    const newMods = [...course.modules];
    newMods[i][field] = val;
    setCourse({ ...course, modules: newMods });
  };

  const submit = async (e) => {
    e.preventDefault();
    await fetch('/api/admin/courses', { method: 'POST', body: JSON.stringify(course) });
    alert('কোর্স সফলভাবে যোগ করা হয়েছে!');
    setCourse({ title: '', desc: '', isFree: false, banner: '', modules: [] });
  };

  return (
    <Card style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--lime-dark)' }}>নতুন কোর্স যোগ করুন</h3>
      <form onSubmit={submit}>
        <Input label="কোর্সের নাম" required value={course.title} onChange={e => setCourse({...course, title: e.target.value})} />
        <Input label="বর্ণনা" value={course.desc} onChange={e => setCourse({...course, desc: e.target.value})} />
        <label style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          <input type="checkbox" checked={course.isFree} onChange={e => setCourse({...course, isFree: e.target.checked})} />
          ফ্রি কোর্স?
        </label>
        <Input label="ব্যানার ইমেজ (Base64/URL)" value={course.banner} onChange={e => setCourse({...course, banner: e.target.value})} />
        
        <div style={{ padding: '1rem', border: '1px dashed var(--gray)', borderRadius: '6px', marginBottom: '1rem' }}>
          <h4>মডিউল এবং ভিডিও (YouTube)</h4>
          {course.modules.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Input placeholder="মডিউল টাইটেল" value={m.title} onChange={e => handleModChange(i, 'title', e.target.value)} />
              <Input placeholder="YouTube URL" value={m.youtubeUrl} onChange={e => handleModChange(i, 'youtubeUrl', e.target.value)} />
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addModule} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>+ মডিউল যোগ করুন</Button>
        </div>
        <Button type="submit">কোর্স সেভ করুন</Button>
      </form>
    </Card>
  );
}
