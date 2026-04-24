'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Task } from '@/app/lib/types';
import TaskInput from './TaskInput';
import TaskList from '@/app/components/TaskList';

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = await res.json();
      if (!data.ok) return;
      const parsed: Task[] = data.tasks.map((t: any) => ({
        id: t.id,
        text: t.text,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        createdAt: new Date(t.createdAt),
      }));
      setTasks(parsed);
    } catch (err) {
      console.error('Failed loading tasks', err);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(taskText: string, dueDate?: Date) {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: taskText, dueDate: dueDate ? dueDate.toISOString() : null }),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = await res.json();
      if (data.ok && data.task) {
        const t = data.task;
        setTasks((prev) => [
          { id: t.id, text: t.text, dueDate: t.dueDate ? new Date(t.dueDate) : null, createdAt: new Date(t.createdAt) },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Add task failed', err);
    }
  }

  async function deleteTask(id: string) {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = await res.json();
      if (data.ok) setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <section className="bg-white/90 border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
          <div className="text-sm text-gray-500">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</div>
        </div>

        <TaskInput onAddTask={addTask} />

        <hr className="my-4 border-t border-gray-100" />

        <TaskList tasks={tasks} onDeleteTask={deleteTask} />
      </section>
    </div>
  );
}
