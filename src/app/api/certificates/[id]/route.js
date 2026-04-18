import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import User from '@/models/User';
import Course from '@/models/Course';
import Settings from '@/models/Settings';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    // ensure models registered
    User.schema; Course.schema; Settings.schema;
    
    const [cert, settings] = await Promise.all([
      Certificate.findById(params.id)
        .populate('userId', 'name')
        .populate('courseId', 'title')
        .lean(),
      Settings.findOne({ key: 'certificate' }).lean()
    ]);

    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      _id: cert._id.toString(),
      user: cert.userId?.name || 'Unknown',
      course: cert.courseId?.title || 'Unknown Course',
      status: cert.status,
      issueDate: cert.issueDate,
      requestedAt: cert.createdAt,
      settings: settings || {}
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
