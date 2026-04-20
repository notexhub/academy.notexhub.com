import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const decoded = await getAuthUser(req);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { courseId } = await req.json();
    if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 });

    await dbConnect();
    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const type = course.isFree ? 'free' : 'subscription';

    // Upsert enrollment (idempotent)
    await Enrollment.findOneAndUpdate(
      { userId: decoded.userId, courseId },
      { userId: decoded.userId, courseId, type },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, enrolled: true });
  } catch (error) {
    // Duplicate key = already enrolled, that's fine
    if (error.code === 11000) return NextResponse.json({ success: true, enrolled: true });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const decoded = await getAuthUser(req);
    if (!decoded) return NextResponse.json({ enrolled: false });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return NextResponse.json({ enrolled: false });

    await dbConnect();
    const exists = await Enrollment.findOne({ userId: decoded.userId, courseId }).lean();
    return NextResponse.json({ enrolled: !!exists });
  } catch {
    return NextResponse.json({ enrolled: false });
  }
}
