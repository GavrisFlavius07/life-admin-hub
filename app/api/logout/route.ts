import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('logout route error', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
