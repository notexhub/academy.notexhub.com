import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const course = await Course.create({
      title: data.title,
      description: data.desc,
      isFree: data.isFree,
      bannerBase64: data.banner,
      modules: data.modules
    });
    return NextResponse.json({ success: true, course });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
