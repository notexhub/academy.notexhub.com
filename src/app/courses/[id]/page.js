import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import Review from '@/models/Review';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EnrollSidebar from '@/components/courses/EnrollSidebar';
import SyllabusAccordion from '@/components/courses/SyllabusAccordion';
import ReviewForm from '@/components/reviews/ReviewForm';
import Link from 'next/link';
import { Star, Users, Video, Calendar, CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }) {
  await dbConnect();
  const raw = await Course.findById(params.id).lean();
  if (!raw) return <div>Course not found</div>;
  const course = JSON.parse(JSON.stringify(raw));
  const token = cookies().get('auth_token')?.value;
  const decoded = token ? await verifyToken(token).catch(() => null) : null;

  // Get full user with subscription info from DB
  let user = null;
  if (decoded?.userId) {
    const dbUser = await User.findById(decoded.userId).select('name email role blocked subscription').lean();
    if (dbUser) {
      user = JSON.parse(JSON.stringify(dbUser));
    }
  }

  // Real-time Stats
  const enrollmentCount = await Enrollment.countDocuments({ courseId: params.id });
  const courseReviews = await Review.find({ courseId: params.id, status: 'approved' }).lean();
  const totalReviews = courseReviews.length;
  const avgRating = totalReviews > 0 
    ? (courseReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';
  const displayStudentCount = enrollmentCount > 0 ? `${enrollmentCount.toLocaleString()}+ শিক্ষার্থী` : 'নতুন কোর্স';
  
  const isEnrolled = decoded ? (await Enrollment.exists({ userId: decoded.userId, courseId: params.id })) : false;

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
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: '#ffffff' }}>{course.title}</h1>
            <p style={{ color: '#cbd5e1', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{course.description}</p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: 'var(--text-sm)', color: '#94a3b8', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} /> <strong style={{ color: '#fbbf24' }}>{avgRating}</strong> ({totalReviews} রিভিউ)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={14} /> {displayStudentCount}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Video size={14} /> {course.modules?.length || 0} টি লেকচার</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> সর্বশেষ আপডেট: ২০২৫</span>
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
              {learns.map((l, i) => <p key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: 'var(--text-sm)', color: 'var(--gray-700)', alignItems: 'flex-start' }}><CheckCircle2 size={16} style={{ color: '#15803d', flexShrink: 0, marginTop: 1 }} />{l}</p>)}
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

          {/* Instructor and Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section id="instructor" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '1.5rem' }}>ইন্সট্রাক্টর পরিচিতি</h2>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div className="w-16 h-16 rounded-2xl bg-[#0f172a] text-[#CCFF00] flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden" style={{ fontSize: '1.5rem' }}>
                  {course.instructor?.image ? (
                    <img src={course.instructor.image} alt={course.instructor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <GraduationCap size={32} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{course.instructor?.name || 'NotexHub Expert Team'}</h3>
                  <p style={{ color: '#5a7a00', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '0.75rem' }}>{course.instructor?.designation || 'সিনিয়র ইন্সট্রাক্টর ও মেন্টর'}</p>
                  <p style={{ color: 'var(--gray-600)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                    {course.instructor?.description || 'অভিজ্ঞ ইন্ডাস্ট্রি মেন্টর। ১০+ বছরের বাস্তব অভিজ্ঞতা নিয়ে শিক্ষার্থীদের ক্যারিয়ার গড়তে সাহায্য করছেন।'}
                  </p>
                </div>
              </div>
            </section>

            {/* User Reviews */}
            <section id="reviews" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '2rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '1.5rem' }}>শিক্ষার্থীদের রিভিউ ({totalReviews})</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                {courseReviews.length === 0 ? (
                  <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>এখনও কোনো রিভিউ নেই।</p>
                ) : courseReviews.map((r, i) => (
                  <div key={r._id} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 16, padding: '1.5rem', display: 'flex', gap: '1.25rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `hsl(${i * 137}, 60%, 40%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                      {r.studentName?.[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{r.studentName}</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[...Array(5)].map((_, j) => <Star key={j} size={10} style={{ color: j < (r.rating || 5) ? '#fbbf24' : '#e5e7eb', fill: j < (r.rating || 5) ? '#fbbf24' : 'none' }} />)}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>&ldquo;{r.quote}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Form */}
              <ReviewForm courseId={params.id} isEnrolled={!!isEnrolled} />
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <EnrollSidebar course={course} user={user} />
      </div>
      <Footer />
    </main>
  );
}
