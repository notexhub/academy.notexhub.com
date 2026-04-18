'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseCard from '@/components/courses/CourseCard';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const qCode = searchParams.get('q');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (qCode) {
      fetch(`/api/courses/search?q=${qCode}`)
        .then(r => r.json())
        .then(d => { setCourses(d); setLoading(false); });
    }
  }, [qCode]);

  return (
    <main style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Navbar />
      <section style={{ backgroundColor: 'var(--navy)', color: 'white', padding: '60px 0' }}>
        <div className="container">
          <h1>&quot;{qCode}&quot; এর ফলাফল</h1>
          <p style={{ marginTop: '0.5rem', color: '#cbd5e0' }}>আমরা {courses.length} টি কোর্স খুঁজে পেয়েছি</p>
        </div>
      </section>
      <section className="container" style={{ padding: '60px 0' }}>
        {loading ? <p>লোড হচ্ছে...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {courses.length === 0 ? <p>দুঃখিত, কোনো কোর্স পাওয়া যায়নি।</p> : courses.map(c => <CourseCard key={c._id} course={c} />)}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
