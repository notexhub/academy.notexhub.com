import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const url = new URL('/', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set('notex_session', '', { maxAge: 0, path: '/' });
  return response;
}

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  response.cookies.set('notex_session', '', { maxAge: 0, path: '/' });
  return response;
}
