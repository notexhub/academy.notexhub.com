import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.findOne({ key: 'certificate' }).lean() || {};
    
    // Explicitly return only public safe data
    return NextResponse.json({
      bkashNumber: settings.bkashNumber || '',
      nagadNumber: settings.nagadNumber || '',
      rocketNumber: settings.rocketNumber || '',
      websiteLogoBase64: settings.websiteLogoBase64 || ''
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
