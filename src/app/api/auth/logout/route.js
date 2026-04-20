import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  cookies().delete('auth_token');
  const url = new URL('/', request.url);
  return NextResponse.redirect(url);
}

export async function POST() {
  cookies().delete('auth_token');
  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
