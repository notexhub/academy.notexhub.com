import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SubscriptionRequest from '@/models/SubscriptionRequest';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET all requests for admin
export async function GET() {
  try {
    const token = cookies().get('notex_session')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    await dbConnect();
    const requests = await SubscriptionRequest.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Fetch Subscriptions Error:', error);
    return NextResponse.json({ message: 'Failed to fetch requests' }, { status: 500 });
  }
}

// PATCH approve/reject request
export async function PATCH(request) {
  try {
    const token = cookies().get('notex_session')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    await dbConnect();
    const { requestId, status, comment } = await request.json();

    const subReq = await SubscriptionRequest.findById(requestId);
    if (!subReq) return NextResponse.json({ message: 'Request not found' }, { status: 404 });

    subReq.status = status;
    subReq.adminComment = comment || '';
    await subReq.save();

    if (status === 'approved') {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + subReq.period);

      await User.findByIdAndUpdate(subReq.userId, {
        subscription: {
          plan: subReq.planName,
          expiresAt: expiry
        }
      });
    }

    return NextResponse.json({ success: true, message: `Request ${status} successfully` });
  } catch (error) {
    console.error('Admin Subscription Action Error:', error);
    return NextResponse.json({ message: 'Action failed' }, { status: 500 });
  }
}
