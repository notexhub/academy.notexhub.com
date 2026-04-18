'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CourseFormFields from '../CourseFormFields';

export default function CreateCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const save = async (form) => {
    setSaving(true);
    await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    router.push('/admin/courses');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b border-[#e2e8f0] pb-6">
        <Link href="/admin/courses" className="w-10 h-10 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl hover:bg-[#f8fafc] transition-colors text-[#0f172a]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-1">কন্টেন্ট ম্যানেজমেন্ট</p>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">নতুন কোর্স তৈরি করুন</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#f1f5f9] p-8 min-h-[600px]">
        <CourseFormFields onSave={save} onCancel={() => router.push('/admin/courses')} loading={saving} />
      </div>
    </div>
  );
}
