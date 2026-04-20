import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (user.blocked) return NextResponse.json({ error: 'Your account is blocked.' }, { status: 403 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken({ userId: user._id.toString(), role: user.role });

    return NextResponse.json({ 
      message: 'Logged in successfully', 
      role: user.role,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: {
          plan: user.subscription?.plan || 'none',
          active: user.subscription?.expiresAt ? new Date(user.subscription.expiresAt) > new Date() : false,
          expiresAt: user.subscription?.expiresAt
        }
      }
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
