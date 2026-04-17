import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Review from '@/models/Review';
import Partner from '@/models/Partner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CourseCard from '@/components/courses/CourseCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const cats = [
  { n: 'ওয়েব ডেভেলপমেন্ট', i: '💻', c: '#dbeafe' }, { n: 'গ্রাফিক ডিজাইন', i: '🎨', c: '#fce7f3' },
  { n: 'ডিজিটাল মার্কেটিং', i: '📱', c: '#d1fae5' }, { n: 'ডেটা সায়েন্স', i: '🔬', c: '#ede9fe' },
  { n: 'বিজনেস', i: '📊', c: '#fef3c7' }, { n: 'প্রোগ্রামিং', i: '⚙️', c: '#ffedd5' },
];

export default async function Home() {
  await dbConnect();
  const courses = JSON.parse(JSON.stringify(await Course.find({}).limit(6).lean()));
  const reviews = JSON.parse(JSON.stringify(await Review.find({}).limit(3).lean()));
  const partners = JSON.parse(JSON.stringify(await Partner.find({}).limit(8).lean()));
  const fallbackPartners = ['Pathao', 'bKash', 'Grameenphone', 'Robi', 'Daraz', 'Shajgoj', 'Chaldal', 'Shohoz'];
  const partnerNames = partners.length > 0 ? partners.map(p => p.companyName) : fallbackPartners;

  return (
    <main>
      <Navbar />
      <Hero />

      {/* Category Section */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="label">ক্যাটাগরি</div>
            <h2 className="section-title">পছন্দের বিষয় বেছে নিন</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
            {cats.map(c => (
              <Link key={c.n} href="/courses" style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1rem', textAlign: 'center', transition: 'var(--transition)', display: 'block' }}>
                <div style={{ width: 52, height: 52, background: c.c, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 0.8rem' }}>{c.i}</div>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', lineHeight: 1.4 }}>{c.n}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section">
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '3rem' }}>
            <div>
              <div className="label">কোর্সসমূহ</div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>জনপ্রিয় কোর্সসমূহ</h2>
            </div>
            <Link href="/courses" className="btn btn-outline btn-sm">সব দেখুন →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {courses.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-sm" style={{ background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-400)', fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>আমাদের গ্রাজুয়েটরা যেখানে কর্মরত আছেন</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2.5rem 4rem', alignItems: 'center' }}>
            {partnerNames.map(name => <span key={name} style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--gray-300)', letterSpacing: '-0.03em' }}>{name}</span>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="label">সাফল্যের গল্প</div>
              <h2 className="section-title">শিক্ষার্থীরা কী বলছেন</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {reviews.map(r => (
                <div key={r._id} className="card card-body">
                  <div style={{ display: 'flex', color: '#f59e0b', gap: 2, marginBottom: '1rem' }}>{'★★★★★'.split('').map((s,i)=><span key={i}>{s}</span>)}</div>
                  <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '1.5rem', fontStyle: 'italic', fontSize: 'var(--text-sm)' }}>"{r.quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="avatar avatar-md">{r.studentName?.[0]}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{r.studentName}</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: '#5a7a00', fontWeight: 600 }}>{r.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--navy), #1a3a5c)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>আজই শুরু করুন আপনার জার্নি</h2>
          <p style={{ color: '#94a3b8', fontSize: 'var(--text-lg)', marginBottom: '2.5rem' }}>১২,০০০+ শিক্ষার্থীর সাথে যোগ দিন এবং আপনার জীবন পরিবর্তন করুন।</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/courses" className="btn btn-lime btn-xl">কোর্স দেখুন</Link>
            <Link href="/register" className="btn btn-xl" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>ফ্রিতে জয়েন করুন</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
