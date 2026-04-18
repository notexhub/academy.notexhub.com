import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Category from '@/models/Category';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  await dbConnect();
  const [rawCourses, rawCats] = await Promise.all([
    Course.find({ isActive: true }).lean(),
    Category.find({ isActive: true }).lean(),
  ]);

  const courses = JSON.parse(JSON.stringify(rawCourses));
  const categories = JSON.parse(JSON.stringify(rawCats));

  return (
    <main>
      <Navbar />
      <section style={{ background: 'linear-gradient(135deg, #0a1628 0%, #111827 100%)', padding: '60px 0', color: 'white' }}>
        <div className="container">
          <div className="label" style={{ background: 'rgba(198,241,53,0.1)', color: 'var(--lime)', borderColor: 'rgba(198,241,53,0.25)' }}>সকল কোর্স</div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>আমাদের কোর্সসমূহ</h1>
          <p style={{ color: '#94a3b8', fontSize: 'var(--text-lg)' }}>ক্যারিয়ার ট্র্যাক ও ফাউন্ডেশন কোর্সগুলোর সম্পূর্ণ তালিকা</p>
        </div>
      </section>
      <CoursesClient courses={courses} categories={categories} />
      <Footer />
    </main>
  );
}
