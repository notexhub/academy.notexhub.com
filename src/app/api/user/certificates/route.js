import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const tk = cookies().get('auth_token')?.value;
    if (!tk) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await verifyToken(tk);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { courseId } = await req.json();
    
    const existing = await Certificate.findOne({ userId: user.userId, courseId });
    if(existing) return NextResponse.json({ error: 'Already requested' }, { status: 400 });

    const c = await Certificate.create({ userId: user.userId, courseId });
    return NextResponse.json({ success: true, c });
  } catch(e) { return NextResponse.json({ error: 'Error' }, { status: 500 }) }
}
