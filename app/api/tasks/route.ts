import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '../../lib/getUserIdFromRequest';
import { getTasksByUser, createTask as dbCreateTask } from '../../lib/db';

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const tasks = await getTasksByUser(userId);

    const payload = tasks.map((t) => ({
      id: t.id,
      text: t.text,
      dueDate: t.due_date ? new Date(t.due_date).toISOString() : null,
      createdAt: t.created_at.toISOString(),
    }));

    return NextResponse.json({ ok: true, tasks: payload }, { status: 200 });
  } catch (err) {
    console.error('tasks GET error', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (!text) return NextResponse.json({ ok: false, error: 'Missing text' }, { status: 400 });

    const dueDate = body.dueDate ? new Date(body.dueDate) : null;

    const created = await dbCreateTask({ userId, text, due_date: dueDate });

    const task = {
      id: created.id,
      text: created.text,
      dueDate: created.due_date ? created.due_date.toISOString() : null,
      createdAt: created.created_at.toISOString(),
    };

    return NextResponse.json({ ok: true, task }, { status: 201 });
  } catch (err) {
    console.error('tasks POST error', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
