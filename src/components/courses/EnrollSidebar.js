import Link from 'next/link';

export default function EnrollSidebar({ course, user }) {
  const id = String(course._id);
  const isFree = course.isFree;
  const hasSub = user?.subscription?.plan && user.subscription.plan !== 'none' && new Date(user.subscription.expiresAt) > new Date();
  const canAccess = isFree || hasSub;

  return (
    <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', position: 'sticky', top: 'calc(var(--header-h) + 1.5rem)' }}>
      {/* Preview Image */}
      <div style={{ height: 200, background: course.bannerBase64 ? `url(${course.bannerBase64}) center/cover` : 'linear-gradient(135deg, #0a1628, #1a3a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
        {!course.bannerBase64 && '🎓'}
      </div>
      <div style={{ padding: '1.75rem' }}>
        {/* Price */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: isFree ? '#5a7a00' : 'var(--navy)' }}>
            {isFree ? 'বিনামূল্যে' : '৳ ১,৫০০'}
          </span>
          {!isFree && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)', textDecoration: 'line-through', marginLeft: '0.5rem' }}>৳ ৩,০০০</span>}
        </div>

        {/* CTA */}
        {canAccess ? (
          <Link href={`/learn/${id}`} className="btn btn-lime btn-block btn-lg" style={{ marginBottom: '0.75rem' }}>
            {isFree ? 'কোর্স শুরু করুন →' : 'কোর্স চালিয়ে যান →'}
          </Link>
        ) : user ? (
          <Link href="/pricing" className="btn btn-navy btn-block btn-lg" style={{ marginBottom: '0.75rem' }}>সাবস্ক্রিপশন কিনুন</Link>
        ) : (
          <Link href="/login" className="btn btn-navy btn-block btn-lg" style={{ marginBottom: '0.75rem' }}>লগ ইন করে শুরু করুন</Link>
        )}
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 'var(--text-xs)', marginBottom: '1.5rem' }}>৩০ দিনের মানি–ব্যাক গ্যারান্টি</p>

        {/* Features */}
        <div className="divider" />
        <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: 'var(--text-sm)' }}>এই কোর্সে যা পাবেন:</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            `📹 ${course.modules?.length || 0} টি ভিডিও লেকচার`,
            '♾️ লাইফটাইম এক্সেস', '📱 মোবাইল ও ডেস্কটপে দেখুন',
            '🏆 কোর্স কমপ্লিশন সার্টিফিকেট', '💬 ইন্সট্রাক্টর সাপোর্ট',
          ].map(f => <li key={f} style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>{f}</li>)}
        </ul>
        <div className="divider" />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>শেয়ার করুন:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {['📘', '🐦', '💼'].map(i => <button key={i} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--gray-200)', background: 'white', cursor: 'pointer', fontSize: '1rem' }}>{i}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
