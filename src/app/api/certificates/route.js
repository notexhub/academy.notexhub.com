import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import Course from '@/models/Course';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'লগইন করা নেই। আবার লগইন করুন।' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ error: 'সেশন মেয়াদোত্তীর্ণ। আবার লগইন করুন।' }, { status: 401 });

    const body = await req.json();
    const { courseId } = body;
    if (!courseId) return NextResponse.json({ error: 'কোর্স আইডি পাওয়া যায়নি।' }, { status: 400 });

    await dbConnect();

    // Check if already applied
    const existing = await Certificate.findOne({ userId: payload.userId, courseId });
    if (existing) {
      return NextResponse.json({ error: 'এই কোর্সের জন্য ইতিমধ্যে আবেদন করা হয়েছে।' }, { status: 400 });
    }

    const [user, course] = await Promise.all([
      User.findById(payload.userId).lean(),
      Course.findById(courseId).lean()
    ]);

    if (!user) return NextResponse.json({ error: 'ইউজার পাওয়া যায়নি।' }, { status: 404 });
    if (!course) return NextResponse.json({ error: 'কোর্স পাওয়া যায়নি।' }, { status: 404 });

    // Verify 80% completion
    const progress = user.progress?.find(p => String(p.courseId) === String(courseId));
    const completedLength = progress?.completedModules?.length || 0;
    const totalLength = course.modules?.length || 0;

    if (totalLength === 0) {
      return NextResponse.json({ error: 'এই কোর্সে কোনো মডিউল নেই, তাই সার্টিফিকেট আবেদন সম্ভব নয়।' }, { status: 400 });
    }

    const pct = (completedLength / totalLength) * 100;

    if (pct < 80) {
      return NextResponse.json({
        error: `সার্টিফিকেট আবেদনের জন্য কমপক্ষে ৮০% মডিউল সম্পন্ন করতে হবে। আপনার বর্তমান অগ্রগতি: ${Math.round(pct)}%।`
      }, { status: 403 });
    }

    // Create Request
    const cert = await Certificate.create({
      userId: payload.userId,
      courseId,
      status: 'pending'
    });

    return NextResponse.json(cert, { status: 201 });

  } catch (error) {
    console.error('[Certificate Apply Error]', error);
    return NextResponse.json({ error: `সার্ভার সমস্যা: ${error.message}` }, { status: 500 });
  }
}
