import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Certificate from '@/models/Certificate';

export async function PUT(req) {
  try {
    await dbConnect();
    const { id, status } = await req.json();
    await Certificate.findByIdAndUpdate(id, { status, issueDate: status === 'approved' ? new Date() : null });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
