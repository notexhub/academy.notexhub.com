'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function loginAction(prevState, formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');
    const redirectTo = formData.get('redirect') || '';

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) return { error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে' };
    if (user.blocked) return { error: 'আপনার অ্যাকাউন্ট ব্লক করা হয়েছে' };

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে' };

    const token = await signToken({ userId: user._id.toString(), role: user.role });

    // This is 100% guaranteed to set the cookie before redirect
    cookies().set('notex_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    const dest = redirectTo || (user.role === 'admin' ? '/admin' : '/dashboard');
    redirect(dest);
  } catch (err) {
    // redirect() throws NEXT_REDIRECT — don't catch that
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
    return { error: 'সার্ভার সমস্যা হয়েছে, আবার চেষ্টা করুন' };
  }
}

export async function registerAction(prevState, formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const redirectTo = formData.get('redirect') || '';

    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) return { error: 'এই ইমেইলে আগেই অ্যাকাউন্ট আছে' };

    const hashedPassword = await bcrypt.hash(password, 10);
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password: hashedPassword, role });
    const token = await signToken({ userId: user._id.toString(), role: user.role });

    cookies().set('notex_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    const dest = redirectTo || (role === 'admin' ? '/admin' : '/dashboard');
    redirect(dest);
  } catch (err) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
    return { error: 'সার্ভার সমস্যা হয়েছে, আবার চেষ্টা করুন' };
  }
}
