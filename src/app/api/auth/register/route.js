import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    // First user becomes admin automatically for testing purposes
    const count = await User.countDocuments();
    const role = count === 0 ? 'admin' : 'user';

    const user = await User.create({ name, email, password: hashedPassword, role });
    
    // Auto-login
    const token = await signToken({ userId: user._id.toString(), role: user.role });
    const response = NextResponse.json({ message: 'User created successfully', role: user.role }, { status: 201 });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
