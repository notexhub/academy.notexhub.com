import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import CourseForm from './CourseForm';

export default async function AdminCourses() {
  await dbConnect();
  const courses = await Course.find({}).lean();
  
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>কোর্স ম্যানেজমেন্ট</h1>
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {courses.length === 0 ? <p>কোনো কোর্স পাওয়া যায়নি।</p> : courses.map(c => (
          <div key={c._id.toString()} style={{ padding: '1rem', border: '1px solid var(--gray)', borderRadius: '6px' }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{c.title}</span>
              <span style={{ fontSize: '0.9rem', color: c.isFree ? 'green' : 'var(--lime-dark)' }}>{c.isFree ? 'Free' : 'Premium'}</span>
            </h3>
            <p>Modules: {c.modules.length}</p>
          </div>
        ))}
      </div>

      <CourseForm />
    </div>
  );
}
