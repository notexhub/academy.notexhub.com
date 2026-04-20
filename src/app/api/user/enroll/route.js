import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    
    if (!token || token === 'null' || token === 'undefined') {
      token = cookies().get('notex_session')?.value;
    }

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = await verifyToken(token);
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
    const authHeader = req.headers.get('Authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    
    if (!token || token === 'null' || token === 'undefined') {
      token = cookies().get('notex_session')?.value;
    }

    if (!token) return NextResponse.json({ enrolled: false });
    const decoded = await verifyToken(token).catch(() => null);
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
