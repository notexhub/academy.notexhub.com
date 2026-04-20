import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function verifyAdmin() {
  const token = cookies().get('notex_session')?.value;
  if (!token) return { error: 'Unauthorized', status: 401 };
  
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') return { error: 'Forbidden', status: 403 };

  return { payload };
}

export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await dbConnect();
    const plans = await Plan.find({}).sort({ price: 1 }).lean();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await verifyAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await dbConnect();
    const body = await req.json();
    
    // Automatically generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const plan = await Plan.create(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req) {
  try {
    const auth = await verifyAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;

    const plan = await Plan.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await verifyAdmin();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await Plan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
