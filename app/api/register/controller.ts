import { NextResponse } from 'next/server';
import { createUser, findUserByEmail, findUserByUsername } from '../../lib/db';
import { hashPassword } from '../../lib/auth';

/**
 * registerController
 * - Parses request body
 * - Validates `email` and `password`
 * - Checks for existing user by email/username
 * - Hashes password and creates a new user via Prisma-backed DB util
 */
export async function registerController(req: Request) {
  const body = await req.json().catch(() => null);
  const { username, email, password } = body ?? {};

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'Missing email or password' }, { status: 400 });
  }

  const emailStr = String(email).trim().toLowerCase();
  const passwordStr = String(password);
  let usernameStr = username ? String(username).trim() : '';

  // Basic validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailStr)) {
    return NextResponse.json({ ok: false, error: 'Invalid email format' }, { status: 400 });
  }

  if (passwordStr.length < 8) {
    return NextResponse.json({ ok: false, error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  // Derive a username from email if none provided
  if (!usernameStr) {
    usernameStr = emailStr.split('@')[0];
  }

  if (usernameStr.length < 3) {
    return NextResponse.json({ ok: false, error: 'Username must be at least 3 characters' }, { status: 400 });
  }

  try {
    // Check duplicates (email and username)
    const existingEmail = await findUserByEmail(emailStr);
    if (existingEmail) {
      return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 });
    }

    const existingUsername = await findUserByUsername(usernameStr);
    if (existingUsername) {
      return NextResponse.json({ ok: false, error: 'Username already in use' }, { status: 409 });
    }

    // Hash the password and create the user
    const password_hash = await hashPassword(passwordStr);
    const user = await createUser({ username: usernameStr, email: emailStr, password_hash });

    // Return safe user info
    const safeUser = { id: user.id, username: user.username, email: user.email, created_at: user.created_at };
    return NextResponse.json({ ok: true, user: safeUser }, { status: 201 });
  } catch (err) {
    console.error('registerController error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
