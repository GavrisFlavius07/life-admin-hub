/**
 * Auth utilities using bcryptjs for hashing.
 * - `hashPassword` produces a salted hash
 * - `verifyPassword` compares plain password to the stored hash
 *
 * NOTE: Install `bcryptjs` in the project to use these functions:
 * `npm install bcryptjs`
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/** Hash a plain password. */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/** Verify a plain password against a hash. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/** Generate an auth token (JWT/session). */
export function generateToken(payload: object): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not configured (process.env.JWT_SECRET)');
  }
  return jwt.sign(payload as any, secret, { expiresIn: '1h' });
}
