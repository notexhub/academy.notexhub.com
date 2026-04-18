'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, BookOpen } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => { const d = await fetch('/api/admin/courses').then(r => r.json()); setCourses(Array.isArray(d) ? d : []); setLoading(false); };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    await fetch('/api/admin/courses', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setCourses(c => c.filter(x => x._id !== id));
  };

  const toggle = async (c) => {
    await fetch('/api/admin/courses', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c._id, isActive: !c.isActive }) });
    setCourses(cs => cs.map(x => x._id === c._id ? { ...x, isActive: !x.isActive } : x));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>কন্টেন্ট ম্যানেজমেন্ট</p>
          <h2 className="text-2xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>কোর্স ম্যানেজমেন্ট</h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>সব কোর্স এখানে পরিচালনা করুন</p>
        </div>
        <Link href="/admin/courses/create" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
          style={{ background: '#CCFF00', color: '#0f172a' }}>
          <Plus size={16} /> নতুন কোর্স
        </Link>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['কোর্স', 'ক্যাটাগরি', 'মূল্য', 'স্ট্যাটাস', 'অ্যাকশন'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8', background: '#fafafa' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-16 text-sm" style={{ color: '#94a3b8' }}>লোড হচ্ছে...</td></tr>
            ) : (!courses || courses.length === 0) ? (
              <tr><td colSpan={5} className="text-center py-16" style={{ color: '#94a3b8' }}>
                <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">কোনো কোর্স নেই। নতুন কোর্স যোগ করুন।</p>
              </td></tr>
            ) : courses?.map(c => (
              <tr key={c._id} style={{ borderBottom: '1px solid #f8fafc' }}
                className="hover:bg-[#fafafa] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#f1f5f9' }}>
                      {c.bannerBase64 ? <img src={c.bannerBase64} className="w-full h-full object-cover" alt="" /> : <BookOpen size={16} className="m-auto mt-1.5" style={{ color: '#cbd5e1' }} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-1" style={{ color: '#0f172a' }}>{c.title}</p>
                      <p className="text-xs line-clamp-1 mt-0.5 max-w-[250px]" style={{ color: '#94a3b8' }}>{c.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" style={{ background: '#f1f5f9', color: '#475569' }}>{c.category}</span>
                </td>
                <td className="px-5 py-3.5">
                  {c.isFree ? <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: '#dcfce7', color: '#15803d' }}>ফ্রি</span>
                    : <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>৳{Number(c.price).toLocaleString()}</span>}
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggle(c)} className="flex items-center gap-1.5 text-xs font-bold rounded-full px-2.5 py-1 transition-all"
                    style={{ background: c.isActive ? '#dcfce7' : '#fee2e2', color: c.isActive ? '#15803d' : '#dc2626' }}>
                    {c.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {c.isActive ? 'সক্রিয়' : 'বন্ধ'}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/courses/${c._id}`} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-[#0f172a] hover:text-[#CCFF00]"
                      style={{ background: '#f1f5f9', color: '#475569' }}>
                      <Pencil size={12} /> এডিট
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ background: '#fee2e2', color: '#dc2626' }}>
                          <Trash2 size={12} /> ডিলিট
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent style={{ borderRadius: 16 }}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>কোর্স ডিলিট করবেন?</AlertDialogTitle>
                          <AlertDialogDescription>এই কোর্সটি স্থায়ীভাবে মুছে যাবে এবং পুনরুদ্ধার করা যাবে না।</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>বাতিল</AlertDialogCancel>
                          <AlertDialogAction onClick={() => del(c._id)} style={{ background: '#dc2626' }}>ডিলিট করুন</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
