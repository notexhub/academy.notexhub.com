import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function guard() {
  const t = cookies().get('auth_token')?.value;
  if (!t) throw new Error('Unauthorized');
  const u = await verifyToken(t);
  if (!u || u.role !== 'admin') throw new Error('Forbidden');
}

export async function GET() {
  try {
    await guard();
    await dbConnect();
    const courses = await Course.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(courses);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 401 }); }
}

export async function POST(req) {
  try {
    await guard();
    await dbConnect();
    const data = await req.json();
    const course = await Course.create(data);
    return NextResponse.json({ success: true, course });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PUT(req) {
  try {
    await guard();
    await dbConnect();
    const { id, ...data } = await req.json();
    const course = await Course.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, course });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req) {
  try {
    await guard();
    await dbConnect();
    const { id } = await req.json();
    await Course.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
