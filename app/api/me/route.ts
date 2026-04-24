import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '../../lib/getUserIdFromRequest';
import { findUserById } from '../../lib/db';

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const user = await findUserById(userId);
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const safeUser = { id: user.id, username: user.username, email: user.email };
    return NextResponse.json({ ok: true, user: safeUser }, { status: 200 });
  } catch (err) {
    console.error('me route error', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
