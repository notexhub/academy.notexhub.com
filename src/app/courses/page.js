import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/courses/CourseCard';
import CourseFilters from '@/components/courses/CourseFilters';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  await dbConnect();
  const raw = await Course.find({}).lean();
  const courses = JSON.parse(JSON.stringify(raw));

  return (
    <main>
      <Navbar />
      {/* Page Header */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628 0%, #111827 100%)', padding: '60px 0', color: 'white' }}>
        <div className="container">
          <div className="label" style={{ background: 'rgba(198,241,53,0.1)', color: 'var(--lime)', borderColor: 'rgba(198,241,53,0.25)' }}>সকল কোর্স</div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>আমাদের কোর্সসমূহ</h1>
          <p style={{ color: '#94a3b8', fontSize: 'var(--text-lg)' }}>ক্যারিয়ার ট্র্যাক ও ফাউন্ডেশন কোর্সগুলোর সম্পূর্ণ তালিকা</p>
        </div>
      </section>

      <section style={{ background: 'var(--gray-50)', paddingTop: 0 }}>
        <div className="container" style={{ display: 'flex', gap: '2rem', padding: '2.5rem 1.5rem', alignItems: 'flex-start' }}>
          <CourseFilters />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '1.5rem' }}>{courses.length} টি কোর্স পাওয়া গেছে</p>
            {courses.length === 0 ? (
              <div className="empty-state" style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)' }}>
                <div className="empty-state-icon">📚</div>
                <p className="empty-state-text">এখনো কোনো কোর্স যোগ করা হয়নি।</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                {courses.map(c => <CourseCard key={c._id} course={c} />)}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
