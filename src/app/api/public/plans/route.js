import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const plans = await Plan.find({}).sort({ price: 1 }).lean();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
