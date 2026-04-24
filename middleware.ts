import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Middleware to protect task APIs.
 * - Verifica JWT preso dal cookie `token` o dall'header `Authorization`
 * - Se il token non è valido o mancante, risponde 401
 */
export async function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get('token');
  const tokenFromCookie = tokenCookie?.value ?? null;

  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization');
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = tokenFromCookie ?? tokenFromHeader;

  // If no token present and request is for a page route, redirect to /login
  const isPageRequest = req.nextUrl.pathname && !req.nextUrl.pathname.startsWith('/api');
  if (!token) {
    if (isPageRequest) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    return new NextResponse(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET not configured');
    return new NextResponse(JSON.stringify({ ok: false, error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));

    // Extract userId from token payload (support `userId` or `sub`)
    const userId = (payload as any).userId ?? (payload as any).sub ?? null;

    // Forward userId to downstream handlers via header
    const requestHeaders = new Headers(req.headers);
    if (userId) requestHeaders.set('x-user-id', String(userId));

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    console.error('JWT verification failed in middleware', err);
    // If this was a page navigation, redirect to login instead of returning JSON
    const isPageRequest = req.nextUrl.pathname && !req.nextUrl.pathname.startsWith('/api');
    if (isPageRequest) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    return new NextResponse(JSON.stringify({ ok: false, error: 'Invalid token' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export const config = {
  matcher: ['/', '/api/tasks/:path*', '/dashboard', '/dashboard/:path*'],
};
