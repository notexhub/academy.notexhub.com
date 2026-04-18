import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

async function verifyAdmin() {
  const token = cookies().get('auth_token')?.value;
  if (!token) return { error: 'Unauthorized', status: 401 };
  
  const payload = await verifyToken(token);
  if (!payload) return { error: 'Unauthorized', status: 401 };

  if (payload.role !== 'admin') return { error: 'Forbidden', status: 403 };

  return { payload };
}

export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const users = await User.find({}).select('-password').lean();
    return NextResponse.json(users);
  } catch (e) { 
    return NextResponse.json({ error: 'Failed' }, { status: 500 }); 
  }
}

export async function POST(req) {
  try {
    const auth = await verifyAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin' // Create directly as admin
    });

    return NextResponse.json({ success: true, user: { _id: newUser._id, name, email, role: 'admin' } }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PATCH(req) {
  try {
    const auth = await verifyAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
    
    await dbConnect();
    const { id, blocked, subscription, role } = await req.json();
    const update = {};
    if (blocked !== undefined) update.blocked = blocked;
    if (subscription) update.subscription = subscription;
    if (role) update.role = role;
    
    await User.findByIdAndUpdate(id, update);
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
