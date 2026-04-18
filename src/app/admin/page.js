import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import Review from '@/models/Review';
import Certificate from '@/models/Certificate';
import { BookOpen, Users, Star, TrendingUp, ArrowUpRight, Activity, Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await dbConnect();
  
  // Basic Stats
  const [courses, users, reviews, certs] = await Promise.all([
    Course.countDocuments(), 
    User.countDocuments(), 
    Review.countDocuments(),
    Certificate.find({}).sort({ createdAt: -1 }).limit(5).populate('userId', 'name').populate('courseId', 'title').lean()
  ]);

  // Recent Users
  const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).lean();

  const stats = [
    { label: 'মোট কোর্স', value: courses, icon: BookOpen, color: '#dbeafe', iconColor: '#2563eb', trend: '+2 এই মাসে' },
    { label: 'মোট শিক্ষার্থী', value: users, icon: Users, color: '#dcfce7', iconColor: '#16a34a', trend: '+48 এই মাসে' },
    { label: 'রিভিউ সংখ্যা', value: reviews, icon: Star, color: '#fef9c3', iconColor: '#ca8a04', trend: '+12 এই সপ্তাহে' },
    { label: 'মাসিক আয়', value: '৳৪৫,০০০', icon: TrendingUp, color: '#fce7f3', iconColor: '#db2777', trend: '+৳৮,০০০' },
  ];

  const quickLinks = [
    { href: '/admin/courses', title: 'কোর্স ম্যানেজমেন্ট', desc: 'ভিডিও মডিউলসহ কোর্স তৈরি ও সম্পাদনা', color: '#dbeafe', border: '#bfdbfe' },
    { href: '/admin/users', title: 'ইউজার ম্যানেজমেন্ট', desc: 'সাবস্ক্রিপশন ও ব্লক নিয়ন্ত্রণ', color: '#dcfce7', border: '#bbf7d0' },
    { href: '/admin/certificates', title: 'সার্টিফিকেট অনুমোদন', desc: 'পেন্ডিং সার্টিফিকেট রিভিউ করুন', color: '#fef9c3', border: '#fef08a' },
    { href: '/admin/reviews', title: 'রিভিউ ম্যানেজমেন্ট', desc: 'হোমপেজ টেস্টিমোনিয়াল নিয়ন্ত্রণ', color: '#fce7f3', border: '#fbcfe8' },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>ওভারভিউ</p>
        <h2 className="text-3xl font-black" style={{ color: '#0f172a', letterSpacing: '-0.03em' }}>স্বাগতম, Admin 👋</h2>
        <p className="mt-1 text-sm" style={{ color: '#64748b' }}>আপনার প্ল্যাটফর্মের সামগ্রিক পরিসংখ্যান</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.color }}>
                  <Icon size={20} style={{ color: s.iconColor }} />
                </div>
                <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#16a34a' }}>
                  <ArrowUpRight size={12} />{s.trend}
                </span>
              </div>
              <p className="text-3xl font-black mb-0.5" style={{ color: '#0f172a', letterSpacing: '-0.03em' }}>{s.value}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Quick Actions (2 cols) */}
        <div className="col-span-2">
          <h3 className="text-base font-bold mb-4" style={{ color: '#0f172a' }}>দ্রুত অ্যাকশন</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((q, i) => (
              <a key={i} href={q.href} className="flex items-center gap-4 rounded-2xl p-5 no-underline transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
                style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: q.color, border: `1px solid ${q.border}` }}></div>
                <div>
                  <p className="font-bold text-sm mb-0.5" style={{ color: '#0f172a' }}>{q.title}</p>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>{q.desc}</p>
                </div>
                <ArrowUpRight size={16} className="ml-auto flex-shrink-0 text-[#cbd5e1] group-hover:text-[#0f172a] transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity (1 col) */}
        <div className="col-span-1">
          <h3 className="text-base font-bold mb-4" style={{ color: '#0f172a' }}>সাম্প্রতিক অ্যাক্টিভিটি</h3>
          <div className="bg-white rounded-2xl border border-[#f1f5f9] p-5 shadow-sm h-[220px] overflow-y-auto">
            <div className="space-y-4">
              {certs.map((c, i) => (
                <div key={`cert-${i}`} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#fef9c3] flex items-center justify-center shrink-0">
                    <ShieldCheck size={14} className="text-[#a16207]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] truncate leading-tight">
                      {c.userId?.name || 'Unknown'} <span className="font-normal text-[#64748b]">requested certificate</span>
                    </p>
                    <p className="text-xs text-[#94a3b8] truncate">{c.courseId?.title}</p>
                  </div>
                </div>
              ))}
              {recentUsers.map((u, i) => (
                <div key={`user-${i}`} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0 text-xs font-bold text-[#15803d]">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a] truncate leading-tight">
                      {u.name} <span className="font-normal text-[#64748b]">registered</span>
                    </p>
                    <p className="text-xs text-[#94a3b8] flex items-center gap-1"><Clock size={10} /> {new Date(u.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
