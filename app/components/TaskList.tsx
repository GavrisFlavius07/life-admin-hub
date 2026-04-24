'use client';

import type { Task } from '@/app/lib/types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ tasks, onDeleteTask }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500 text-sm">No tasks yet — add one above.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDeleteTask} />
      ))}
    </ul>
  );
}
