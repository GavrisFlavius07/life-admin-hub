import { NextResponse } from 'next/server';
import { registerController } from './controller';

export async function POST(req: Request) {
  try {
    return await registerController(req);
  } catch (err) {
    console.error('Register route error', err);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
