import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/login');
  const userTk = await verifyToken(token).catch(() => null);
  if (!userTk) redirect('/login');

  await dbConnect();
  const u = await User.findById(String(userTk.userId)).lean();
  if (!u) redirect('/login');
  const allCourses = await Course.find({}).lean();
  const courses = JSON.parse(JSON.stringify(allCourses));
  const userCourses = (u.progress || []).map(p => {
    const c = courses.find(x => String(x._id) === String(p.courseId));
    if (!c) return null;
    const pct = c.modules?.length ? Math.round((p.completedModules.length / c.modules.length) * 100) : 0;
    return { ...c, pct, completedModules: p.completedModules };
  }).filter(Boolean);

  const hasSub = u.subscription?.plan && u.subscription.plan !== 'none' && new Date(u.subscription.expiresAt) > new Date();

  return (
    <main style={{ background: 'var(--gray-50)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ display: 'flex', gap: '2rem', padding: '2.5rem 1.5rem', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: 260, flexShrink: 0 }}>
          <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0a1628, #111827)', padding: '1.5rem', textAlign: 'center' }}>
              <div className="avatar avatar-lg" style={{ margin: '0 auto 0.75rem', fontSize: '1.8rem' }}>{u.name?.[0]}</div>
              <p style={{ color: 'white', fontWeight: 700 }}>{u.name}</p>
              <p style={{ color: '#64748b', fontSize: 'var(--text-xs)', marginTop: 2 }}>{u.email}</p>
              {hasSub && <span style={{ display: 'inline-block', marginTop: '0.5rem', background: 'var(--lime)', color: 'var(--navy)', padding: '0.2rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>⭐ {u.subscription.plan}</span>}
            </div>
            <nav style={{ padding: '0.75rem' }}>
              {[
                { l: '/dashboard', n: 'আমার কোর্স', i: '🎓' },
                { l: '/dashboard/certificates', n: 'সার্টিফিকেট', i: '🏆' },
                { l: '/pricing', n: 'সাবস্ক্রিপশন', i: '⭐' },
                { l: '/api/auth/logout', n: 'লগ আউট', i: '🚪' },
              ].map(item => (
                <a key={item.l} href={item.l} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--gray-700)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none', transition: 'var(--transition)' }}>
                  <span>{item.i}</span> {item.n}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '1.5rem' }}>আমার কোর্সসমূহ</h2>
          {userCourses.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: '4rem', textAlign: 'center' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</p>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>আপনি এখনো কোনো কোর্সে অ্যাক্সেস করেননি।</p>
              <Link href="/courses" className="btn btn-lime">কোর্স দেখুন</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              {userCourses.map(c => (
                <div key={c._id} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ height: 140, background: c.bannerBase64 ? `url(${c.bannerBase64}) center/cover` : 'linear-gradient(135deg, #0a1628, #1a3a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{!c.bannerBase64 && '💻'}</div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.4 }}>{c.title}</h3>
                    <div className="progress" style={{ marginBottom: '0.5rem' }}>
                      <div className="progress-bar" style={{ width: `${c.pct}%` }} />
                    </div>
                    <div className="flex-between">
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{c.pct}% সম্পন্ন</span>
                      <Link href={`/learn/${c._id}`} className="btn btn-sm btn-lime">{c.pct > 0 ? 'চালিয়ে যান' : 'শুরু করুন'}</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
