import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function adminGuard() {
  const t = cookies().get('auth_token')?.value;
  if (!t) throw new Error('Unauthorized');
  const u = await verifyToken(t);
  if (!u || u.role !== 'admin') throw new Error('Forbidden');
  return u;
}

export async function GET() {
  try {
    await adminGuard();
    await dbConnect();
    const users = await User.find({}).select('-password').lean();
    return NextResponse.json(users);
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 401 }); }
}

export async function PATCH(req) {
  try {
    await adminGuard();
    await dbConnect();
    const { id, blocked, subscription } = await req.json();
    const update = {};
    if (blocked !== undefined) update.blocked = blocked;
    if (subscription) update.subscription = subscription;
    await User.findByIdAndUpdate(id, update);
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
