'use client';

import type { Task } from '@/app/lib/types';
import { useLocalStorageTasks } from '@/app/hooks/useLocalStorageTasks';
import TaskInput from './TaskInput';
import TaskList from '@/app/components/TaskList';

export default function TaskApp() {
  const { tasks, setTasks } = useLocalStorageTasks();

  const addTask = (taskText: string, dueDate?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      dueDate: dueDate || null,
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

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
