import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে' }, { status: 401 });
    if (user.blocked) return NextResponse.json({ error: 'আপনার অ্যাকাউন্ট ব্লক করা হয়েছে' }, { status: 403 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে' }, { status: 401 });

    const token = await signToken({ userId: user._id.toString(), role: user.role });

    const response = NextResponse.json({
      message: 'লগইন সফল হয়েছে',
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

    // Official Next.js way to set the cookie in a Route Handler
    response.cookies.set('notex_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'সার্ভার সমস্যা হয়েছে' }, { status: 500 });
  }
}
