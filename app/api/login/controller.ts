import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByUsername } from '../../lib/db';
import { verifyPassword, generateToken } from '../../lib/auth';

/**
 * loginController
 * - Accepts `email` or `username`, and `password`
 * - Finds the user by email or username
 * - Verifies password using bcrypt
 * - Returns a signed JWT token when credentials are valid
 */
export async function loginController(req: Request) {
  const body = await req.json().catch(() => null);
  const { email, username, password } = body ?? {};

  if ((!email && !username) || !password) {
    return NextResponse.json({ ok: false, error: 'Missing credentials' }, { status: 400 });
  }

  const identifierEmail = email ? String(email).trim().toLowerCase() : null;
  const identifierUsername = username ? String(username).trim() : null;

  try {
    let user = null;
    if (identifierEmail) {
      user = await findUserByEmail(identifierEmail);
    } else if (identifierUsername) {
      user = await findUserByUsername(identifierUsername);
    }

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordOk = await verifyPassword(String(password), user.password_hash);
    if (!passwordOk) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken({ userId: user.id });

    const safeUser = { id: user.id, username: user.username, email: user.email };

    // Set httpOnly cookie (1 hour) and also return token in JSON so clients
    // that prefer localStorage can use it. Cookie is preferred for security.
    const res = NextResponse.json({ ok: true, token, user: safeUser }, { status: 200 });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('loginController error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
