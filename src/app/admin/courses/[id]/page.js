'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import CourseFormFields from '../CourseFormFields';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/courses').then(r => r.json()).then(data => {
      const found = data.find(c => c._id === params.id);
      if (found) setCourse(found);
      setLoading(false);
    });
  }, [params.id]);

  const save = async (form) => {
    setSaving(true);
    await fetch('/api/admin/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: params.id, ...form }),
    });
    setSaving(false);
    router.push('/admin/courses');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#64748b]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-semibold">কোর্স লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 text-[#ef4444]">
        <h2 className="text-2xl font-black mb-2">কোর্স পাওয়া যায়নি</h2>
        <Link href="/admin/courses" className="text-[#0f172a] underline font-bold mt-4 inline-block">ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b border-[#e2e8f0] pb-6">
        <Link href="/admin/courses" className="w-10 h-10 flex items-center justify-center bg-white border border-[#e2e8f0] rounded-xl hover:bg-[#f8fafc] transition-colors text-[#0f172a]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-1">কন্টেন্ট আপডেট</p>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">এডিট: {course.title}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#f1f5f9] p-8 min-h-[600px]">
        <CourseFormFields initial={course} onSave={save} onCancel={() => router.push('/admin/courses')} loading={saving} />
      </div>
    </div>
  );
}
