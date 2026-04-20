import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function authAdmin() {
  const token = cookies().get('notex_session')?.value;
  if (!token) throw new Error('Unauthorized');
  const user = await verifyToken(token);
  if (!user || user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

export async function GET(req) {
  try {
    await dbConnect();
    // Public or admin logic? 
    // Usually fetching categories can be public, but let's just make it public accessible since 
    // it will be needed by the frontend form if authors want to create things, 
    // but right now it's requested from admin components.
    const url = new URL(req.url);
    const all = url.searchParams.get('all');
    
    let query = {};
    if (!all) query = { isActive: true }; // for public fetch we only want active ones

    const categories = await Category.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    await authAdmin();
    const body = await req.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = await Category.create({ ...body, slug });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    await authAdmin();
    const { id, ...data } = await req.json();
    if (data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    await authAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    // For DELETE body is sometimes used in next.js Route Handlers but searchParams is safer for DELETE
    let deleteId = id;
    if (!deleteId) {
      const body = await req.json().catch(() => ({}));
      deleteId = body.id;
    }
    await Category.findByIdAndDelete(deleteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
