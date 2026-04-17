import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EnrollSidebar from '@/components/courses/EnrollSidebar';
import SyllabusAccordion from '@/components/courses/SyllabusAccordion';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }) {
  await dbConnect();
  const raw = await Course.findById(params.id).lean();
  if (!raw) return <div>Course not found</div>;
  const course = JSON.parse(JSON.stringify(raw));
  const token = cookies().get('auth_token')?.value;
  const user = token ? await verifyToken(token).catch(() => null) : null;

  const learns = course.whatYouLearn || ['হাতে–কলমে প্রজেক্ট বানাবেন', 'ইন্ডাস্ট্রি স্ট্যান্ডার্ড কোড লিখবেন', 'ফ্রিল্যান্সিং শুরু করতে পারবেন', 'লাইভ ডিপ্লয়মেন্ট করতে পারবেন', 'ব্যবহারকারীর চাহিদা অনুযায়ী ডিজাইন করবেন', 'সিভি ও পোর্টফোলিও তৈরি করবেন'];

  return (
    <main style={{ background: 'var(--gray-50)' }}>
      <Navbar />
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628 0%, #111827 100%)', color: 'white', padding: '50px 0 70px' }}>
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Link href="/courses" style={{ color: '#94a3b8', fontSize: 'var(--text-sm)' }}>কোর্সসমূহ</Link>
              <span style={{ color: '#4b5563' }}>→</span>
              <span style={{ color: '#94a3b8', fontSize: 'var(--text-sm)' }}>{course.category || 'Development'}</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>{course.title}</h1>
            <p style={{ color: '#cbd5e1', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{course.description}</p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: 'var(--text-sm)', color: '#94a3b8' }}>
              <span>⭐ <strong style={{ color: '#fbbf24' }}>5.0</strong> (৫৪৮ রিভিউ)</span>
              <span>👥 ২,৫০০+ শিক্ষার্থী</span>
              <span>📹 {course.modules?.length || 0} টি লেকচার</span>
              <span>🕐 সর্বশেষ আপডেট: ২০২৫</span>
              <span className={`badge ${course.isFree ? 'badge-free' : 'badge-premium'}`}>{course.isFree ? 'বিনামূল্যে' : 'প্রিমিয়াম'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Nav */}
      <div style={{ position: 'sticky', top: 'var(--header-h)', background: 'white', borderBottom: '1px solid var(--gray-200)', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', gap: '2rem' }}>
          {['কি শিখবেন', 'কারিকুলাম', 'ইন্সট্রাক্টর'].map((tab, i) => (
            <a key={tab} href={`#${['learn','curriculum','instructor'][i]}`} style={{ padding: '1rem 0', fontWeight: 600, fontSize: 'var(--text-sm)', color: i === 0 ? 'var(--navy)' : 'var(--gray-500)', borderBottom: i === 0 ? '2px solid var(--lime)' : '2px solid transparent', transition: 'var(--transition)' }}>{tab}</a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', padding: '3rem 1.5rem', alignItems: 'flex-start' }}>
        <div>
          {/* What You'll Learn */}
          <section id="learn" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '1.5rem' }}>এই কোর্সে কি কি শিখবেন</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {learns.map((l, i) => <p key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}><span style={{ color: 'var(--lime-hover)', flexShrink: 0 }}>✓</span>{l}</p>)}
            </div>
          </section>

          {/* Curriculum */}
          <section id="curriculum" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>কোর্স কারিকুলাম</h2>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>{course.modules?.length || 0} টি লেকচার</span>
            </div>
            <SyllabusAccordion modules={course.modules || []} />
          </section>

          {/* Instructor */}
          <section id="instructor" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '1.5rem' }}>ইন্সট্রাক্টর পরিচিতি</h2>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div className="avatar avatar-lg" style={{ fontSize: '1.5rem' }}>🎓</div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>NotexHub Expert Team</h3>
                <p style={{ color: '#5a7a00', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '0.75rem' }}>সিনিয়র ইন্সট্রাক্টর ও মেন্টর</p>
                <p style={{ color: 'var(--gray-600)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>অভিজ্ঞ ইন্ডাস্ট্রি মেন্টর। ১০+ বছরের বাস্তব অভিজ্ঞতা নিয়ে শিক্ষার্থীদের ক্যারিয়ার গড়তে সাহায্য করছেন।</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <EnrollSidebar course={course} user={user} />
      </div>
      <Footer />
    </main>
  );
}
