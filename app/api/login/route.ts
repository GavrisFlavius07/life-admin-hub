import { NextResponse } from 'next/server';
import { loginController } from './controller';

export async function POST(req: Request) {
  try {
    return await loginController(req);
  } catch (err) {
    console.error('Login route error', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
