'use client';

import type { Task } from '@/app/lib/types';
import { formatDate, getDaysUntilDue } from '@/app/lib/dateUtils';
import { getTaskStatus } from '@/app/lib/taskStatus';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onDelete }: TaskItemProps) {
  const status = getTaskStatus(task);
  const daysUntil = getDaysUntilDue(task.dueDate);

  const badgeColor =
    status === 'overdue' ? 'bg-red-50 text-red-600' : status === 'due-soon' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-700';

  return (
    <li className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-md">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">{task.text}</div>
        {task.dueDate && (
          <div className={`inline-flex items-center gap-2 mt-1 text-xs ${badgeColor}`}>
            <span className="font-medium">{status === 'overdue' ? '⚠️' : status === 'due-soon' ? '⏰' : '📅'}</span>
            <span className="text-gray-700">{formatDate(task.dueDate)}{status === 'due-soon' ? ` · ${daysUntil}d` : ''}</span>
          </div>
        )}
      </div>

      <button onClick={() => onDelete(task.id)} aria-label="Delete" className="ml-3 text-red-500 hover:text-red-700 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 011.06 0L10 7.88l2.66-2.66a.75.75 0 111.06 1.06L11.06 8.94l2.66 2.66a.75.75 0 11-1.06 1.06L10 10l-2.66 2.66a.75.75 0 11-1.06-1.06L8.94 8.94 6.28 6.28a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
}
