import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Course from '@/models/Course';
import Certificate from '@/models/Certificate';
import Enrollment from '@/models/Enrollment';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/login');
  const userTk = await verifyToken(token).catch(() => null);
  if (!userTk) redirect('/login');

  await dbConnect();
  const u = await User.findById(String(userTk.userId)).lean();
  if (!u) redirect('/login');
  
  const [allCourses, userCerts, userEnrollments] = await Promise.all([
    Course.find({}).lean(),
    Certificate.find({ userId: u._id }).populate('courseId', 'title').lean(),
    Enrollment.find({ userId: u._id }).lean()
  ]);

  const courses = JSON.parse(JSON.stringify(allCourses));
  const enrolledCourseIds = new Set(userEnrollments.map(e => String(e.courseId)));

  // Only show courses the user is actually enrolled in
  const userCourses = (u.progress || []).map(p => {
    if (!enrolledCourseIds.has(String(p.courseId))) return null;
    const c = courses.find(x => String(x._id) === String(p.courseId));
    if (!c) return null;
    const pct = c.modules?.length ? Math.round(((p.completedModules?.length || 0) / c.modules.length) * 100) : 0;
    return {
      _id: c._id.toString(),
      title: c.title,
      bannerBase64: c.bannerBase64 || null,
      pct,
      completedModules: p.completedModules || [],
      totalModules: c.modules?.length || 0
    };
  }).filter(Boolean);

  // Also add enrolled courses with 0 progress (not yet started)
  enrolledCourseIds.forEach(cid => {
    const already = userCourses.find(c => c._id === cid);
    if (!already) {
      const c = courses.find(x => String(x._id) === cid);
      if (c) {
        userCourses.push({
          _id: c._id.toString(),
          title: c.title,
          bannerBase64: c.bannerBase64 || null,
          pct: 0,
          completedModules: [],
          totalModules: c.modules?.length || 0
        });
      }
    }
  });

  const certificates = userCerts.map(c => ({
    _id: c._id.toString(),
    courseId: c.courseId?._id?.toString() || null,
    courseTitle: c.courseId?.title || 'Unknown Course',
    status: c.status,
    requestedAt: c.createdAt,
    issueDate: c.issueDate
  }));

  const hasSub = u.subscription?.plan && u.subscription.plan !== 'none' && new Date(u.subscription.expiresAt) > new Date();
  
  const subscriptionData = {
    active: hasSub,
    plan: u.subscription?.plan || 'none',
    expiresAt: u.subscription?.expiresAt || null
  };

  const userData = {
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    bio: u.bio || '',
    createdAt: u.createdAt ? u.createdAt.toISOString() : null,
  };

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="pt-[104px]">
        <DashboardClient 
          user={userData} 
          courses={userCourses} 
          certificates={certificates} 
          subscription={subscriptionData} 
        />
      </div>
    </main>
  );
}
