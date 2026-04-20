import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import CourseViewer from './CourseViewer';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LearnPage({ params }) {
  const token = cookies().get('notex_session')?.value;
  if (!token) redirect('/login');

  const userTk = await verifyToken(token).catch(() => null);
  if (!userTk) redirect('/login');

  await dbConnect();
  const [rawCourse, dbUser] = await Promise.all([
    Course.findById(params.courseId).lean(),
    User.findById(String(userTk.userId)).lean()
  ]);

  if (!rawCourse) redirect('/courses');
  if (dbUser?.blocked) redirect('/login?blocked=1');

  // Admin can always access
  if (dbUser?.role !== 'admin') {
    // Check enrollment
    const enrollment = await Enrollment.findOne({
      userId: dbUser?._id,
      courseId: rawCourse._id
    }).lean();

    if (!enrollment) redirect(`/courses/${rawCourse._id}`);

    // Paid course extra guard: subscription still required to watch
    const hasSub = dbUser?.subscription?.plan && dbUser.subscription.plan !== 'none' && new Date(dbUser.subscription.expiresAt) > new Date();
    if (!rawCourse.isFree && !hasSub) redirect(`/courses/${rawCourse._id}`);
  }

  const course = JSON.parse(JSON.stringify(rawCourse));
  const userProgress = dbUser?.progress?.find(p => String(p.courseId) === params.courseId);
  const initialProgress = userProgress?.completedModules || [];

  return <CourseViewer course={course} initialProgress={initialProgress} />;
}

