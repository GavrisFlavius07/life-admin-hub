import { jwtVerify } from 'jose';

/**
 * Extracts userId from the incoming request.
 * Priority order:
 *  - `x-user-id` header (set by middleware)
 *  - `Authorization` header Bearer token
 *  - `cookie` header token named `token`
 */
export async function getUserIdFromRequest(req: Request): Promise<string | null> {
  // header set by middleware
  const headerUserId = req.headers.get('x-user-id');
  if (headerUserId) return headerUserId;

  // Authorization header
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization');
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // Cookie header
  const cookieHeader = req.headers.get('cookie') ?? '';
  const tokenFromCookie = (() => {
    if (!cookieHeader) return null;
    const pairs = cookieHeader.split(';').map((c) => c.trim());
    for (const p of pairs) {
      const [k, v] = p.split('=');
      if (k === 'token') return decodeURIComponent(v ?? '');
    }
    return null;
  })();

  const token = tokenFromHeader ?? tokenFromCookie;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return (payload as any).userId ?? (payload as any).sub ?? null;
  } catch (err) {
    console.error('getUserIdFromRequest failed to verify token', err);
    return null;
  }
}
