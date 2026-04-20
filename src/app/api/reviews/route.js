import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Enrollment from '@/models/Enrollment';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    const query = { status: 'approved' };
    if (courseId) query.courseId = courseId;

    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(limit);
    return NextResponse.json(reviews);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = cookies().get('auth_token')?.value;
    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { courseId, rating, quote } = await req.json();

    if (!courseId || !rating || !quote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status:400 });
    }

    // Verify enrollment
    const enrollment = await Enrollment.findOne({ userId: decoded.userId, courseId });
    if (!enrollment) {
      return NextResponse.json({ error: 'You must be enrolled to review this course' }, { status: 403 });
    }

    // Check if review already exists
    const existing = await Review.findOne({ userId: decoded.userId, courseId });
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this course' }, { status: 400 });
    }

    // Fetch user info for name/role
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const review = await Review.create({
      userId: user._id,
      studentName: user.name,
      role: 'Student', // Default role
      courseId,
      rating: Number(rating),
      quote,
      status: 'pending' 
    });

    return NextResponse.json(review);
  } catch (err) {
    console.error("Review creation error:", err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
