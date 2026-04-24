import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '../../../lib/getUserIdFromRequest';
import { getTaskByIdForUser, updateTaskForUser, deleteTaskForUser } from '../../../lib/db';

export async function DELETE(req: Request, context: any) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const id = context?.params?.id;
    const deleted = await deleteTaskForUser(id, userId);
    if (!deleted) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('tasks DELETE error', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const updates: { text?: string; due_date?: Date | null } = {};
    if (typeof body.text === 'string') updates.text = body.text.trim();
    if (body.dueDate !== undefined) updates.due_date = body.dueDate ? new Date(body.dueDate) : null;

    const id = context?.params?.id;
    const updated = await updateTaskForUser(id, userId, updates);
    if (!updated) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    const task = {
      id: updated.id,
      text: updated.text,
      dueDate: updated.due_date ? updated.due_date.toISOString() : null,
      createdAt: updated.created_at.toISOString(),
    };

    return NextResponse.json({ ok: true, task }, { status: 200 });
  } catch (err) {
    console.error('tasks PUT error', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
