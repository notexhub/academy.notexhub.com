import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import User from '@/models/User';
import Course from '@/models/Course';

export async function GET(req) {
  try {
    await dbConnect();
    // register models
    User.schema; Course.schema;
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';
    const query = all ? {} : { status: 'pending' };
    const certs = await Certificate.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('courseId', 'title')
      .lean();
    const result = certs.map(c => ({
      _id: c._id.toString(),
      user: c.userId?.name || 'Unknown',
      email: c.userId?.email || '',
      course: c.courseId?.title || 'Unknown',
      status: c.status || 'pending',
      requestedAt: c.createdAt,
    }));
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    await Certificate.findByIdAndUpdate(id, {
      status,
      issueDate: status === 'approved' ? new Date() : undefined,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
