import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = await signToken({ userId: user._id.toString(), role: user.role });

    const response = NextResponse.json({
      message: 'রেজিস্ট্রেশন সফল হয়েছে',
      role: user.role,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: {
          plan: 'none',
          active: false,
          expiresAt: null
        }
      }
    }, { status: 201 });

    // Definitive Cookie Setting for Vercel
    response.cookies.set('notex_session', token, {
      httpOnly: true,
      secure: true, // Always true for Vercel HTTPS
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'সার্ভার সমস্যা হয়েছে' }, { status: 500 });
  }
}
