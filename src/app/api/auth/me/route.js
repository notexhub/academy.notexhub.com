import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const payload = await getAuthUser(req);
    if (!payload || !payload.userId) {
      return NextResponse.json({ authenticated: false, reason: 'no_session' }, { status: 401 });
    }
 
    await dbConnect();
    const user = await User.findById(payload.userId).select('name email role').lean();
 
    if (!user) {
      return NextResponse.json({ authenticated: false, reason: 'user_not_found' }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
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
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
