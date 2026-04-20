import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Partner from '@/models/Partner';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
  await dbConnect();
  const p = await Partner.find({}).sort({ createdAt: -1 });
  return NextResponse.json(p);
}

export async function POST(req) {
  try {
    const t = cookies().get('notex_session')?.value;
    const ut = await verifyToken(t);
    if (!ut || ut.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const data = await req.json();
    const p = await Partner.create(data);
    return NextResponse.json(p);
  } catch (err) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}

export async function DELETE(req) {
  try {
    const t = cookies().get('notex_session')?.value;
    const ut = await verifyToken(t);
    if (!ut || ut.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    await dbConnect();
    const { id } = await req.json();
    await Partner.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) { return NextResponse.json({ error: 'Error' }, { status: 500 }); }
}
