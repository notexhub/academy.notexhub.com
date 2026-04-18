import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    // Fetch certificate settings which also hold website logo.
    const settings = await Settings.findOne({ key: 'certificate' }).lean();
    if (!settings) {
      return NextResponse.json({ websiteLogoBase64: null });
    }
    return NextResponse.json({ websiteLogoBase64: settings.websiteLogoBase64 || null });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
