import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await dbConnect();
  const [courses, users, reviews] = await Promise.all([
    Course.countDocuments(), User.countDocuments(), Review.countDocuments()
  ]);

  const stats = [
    { label: 'মোট কোর্স', value: courses, icon: '🎓', color: '#dbeafe', trend: '+2 এই মাসে' },
    { label: 'মোট শিক্ষার্থী', value: users, icon: '👥', color: '#d1fae5', trend: '+48 এই মাসে' },
    { label: 'রিভিউ', value: reviews, icon: '⭐', color: '#fef3c7', trend: '+12 এই সপ্তাহে' },
    { label: 'আয় (এই মাসে)', value: '৳৪৫,০০০', icon: '💰', color: '#ede9fe', trend: '+৳৮,০০০' },
  ];

  const quickLinks = [
    { l: '/admin/courses', t: 'নতুন কোর্স যোগ করুন', s: 'ভিডিও মডিউলসহ নতুন কোর্স তৈরি করুন', i: '🎓' },
    { l: '/admin/users', t: 'ইউজার ম্যানেজ করুন', s: 'সাবস্ক্রিপশন এবং ব্লক ব্যবস্থাপনা', i: '👥' },
    { l: '/admin/certificates', t: 'সার্টিফিকেট অনুমোদন', s: 'পেন্ডিং সার্টিফিকেট রিভিউ করুন', i: '🏆' },
    { l: '/admin/reviews', t: 'রিভিউ ম্যানেজ করুন', s: 'হোমপেজ টেস্টিমোনিয়াল নিয়ন্ত্রণ', i: '⭐' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>ওভারভিউ</h2>
        <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem', fontSize: 'var(--text-sm)' }}>আপনার প্ল্যাটফর্মের সামগ্রিক পরিসংখ্যান</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: 48, height: 48, background: s.color, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{s.icon}</div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
            <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>{s.label}</p>
            <p style={{ color: '#16a34a', fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '0.5rem' }}>↑ {s.trend}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '1.25rem' }}>দ্রুত কাজ করুন</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {quickLinks.map(q => (
          <a key={q.l} href={q.l} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', transition: 'var(--transition)', boxShadow: 'var(--shadow-xs)' }}>
            <span style={{ fontSize: '2rem', width: 52, height: 52, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{q.i}</span>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: 'var(--text-sm)', marginBottom: '0.2rem' }}>{q.t}</p>
              <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>{q.s}</p>
            </div>
            <span style={{ marginLeft: 'auto', color: 'var(--gray-300)' }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
