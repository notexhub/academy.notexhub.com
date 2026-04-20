import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

async function getUser() {
  const token = cookies().get('notex_session')?.value;
  if (!token) throw new Error('Unauthorized');
  const decoded = await verifyToken(token);
  if (!decoded) throw new Error('Unauthorized');
  return decoded;
}

export async function PUT(req) {
  try {
    const decoded = await getUser();
    await dbConnect();

    const body = await req.json();
    const { name, email, phone, bio, currentPassword, newPassword } = body;

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check email collision
    if (email && email !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase().trim() });
      if (exists) return NextResponse.json({ error: 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হচ্ছে।' }, { status: 409 });
      user.email = email.toLowerCase().trim();
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: 'বর্তমান পাসওয়ার্ড প্রদান করুন।' }, { status: 400 });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return NextResponse.json({ error: 'বর্তমান পাসওয়ার্ড সঠিক নয়।' }, { status: 400 });
      if (newPassword.length < 6) return NextResponse.json({ error: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' }, { status: 400 });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    return NextResponse.json({ success: true, name: user.name, email: user.email });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
