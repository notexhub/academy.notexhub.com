import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function authAdmin() {
  const token = cookies().get('notex_session')?.value;
  if (!token) throw new Error('Unauthorized');
  const user = await verifyToken(token);
  if (!user || user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

export async function GET() {
  try {
    await dbConnect();
    // No auth guard required for GET if we want it public, but this is an admin route. 
    // We will verify admin.
    await authAdmin();
    const settings = await Settings.findOne({ key: 'certificate' }).lean() || {};
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    await authAdmin();
    const body = await req.json();
    
    // Strip metadata fields that shouldn't be updated or cause Mongoose errors
    const { _id, __v, key, ...updateData } = body;

    const updated = await Settings.findOneAndUpdate(
      { key: 'certificate' },
      { $set: updateData },
      { new: true, upsert: true }
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Settings Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
