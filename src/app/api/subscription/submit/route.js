import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SubscriptionRequest from '@/models/SubscriptionRequest';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const token = cookies().get('notex_session')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload?.userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();
    const { planName, amount, method, transactionId, senderNumber, period } = body;

    // Basic validation
    if (!planName || !amount || !method || !transactionId || !senderNumber || !period) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check for existing TrxID to prevent duplicates
    const existing = await SubscriptionRequest.findOne({ transactionId });
    if (existing) {
      return NextResponse.json({ message: 'This Transaction ID has already been submitted' }, { status: 400 });
    }

    const newRequest = await SubscriptionRequest.create({
      userId: payload.userId,
      planName,
      amount,
      method,
      transactionId,
      senderNumber,
      period,
      status: 'pending'
    });

    return NextResponse.json({ success: true, message: 'Request submitted successfully', id: newRequest._id });
  } catch (error) {
    console.error('Subscription Submission Error:', error);
    return NextResponse.json({ message: 'Failed to submit request' }, { status: 500 });
  }
}
