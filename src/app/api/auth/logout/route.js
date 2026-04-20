import { NextResponse } from 'next/server';

export async function GET(request) {
  // GET should not clear cookies passively (to prevent prefetch-logout)
  // Instead, it just redirects home
  const url = new URL('/', request.url);
  return NextResponse.redirect(url);
}

export async function POST() {
  // Clear cookie only on explicit POST request
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  
  response.cookies.set('notex_session', '', { 
    maxAge: 0, 
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax'
  });
  
  return response;
}
