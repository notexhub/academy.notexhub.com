import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function authAdmin() {
  const token = cookies().get('notex_session')?.value;
  if (!token) return { error: 'Unauthorized', status: 401 };
  
  const payload = await verifyToken(token);
  if (!payload) return { error: 'Unauthorized', status: 401 };

  if (payload.role !== 'admin') return { error: 'Forbidden', status: 403 };
  
  return { payload };
}

export async function GET() {
  try {
    const auth = await authAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
    
    await dbConnect();

    const enrollments = await Enrollment.find({})
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 })
      .lean();

    const data = enrollments.map(e => ({
      _id: e._id?.toString(),
      userId: e.userId?._id?.toString(),
      userName: e.userId?.name || 'Unknown',
      userEmail: e.userId?.email || '',
      courseId: e.courseId?._id?.toString(),
      courseTitle: e.courseId?.title || 'Unknown Course',
      type: e.type,
      enrolledAt: e.enrolledAt || e.createdAt,
    }));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
