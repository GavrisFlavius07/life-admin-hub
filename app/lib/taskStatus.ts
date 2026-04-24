/**
 * Task Status and Styling Utilities
 * Determines task status and returns appropriate styling
 */

import { isOverdue, isDueSoon, getDaysUntilDue } from './dateUtils';
import type { Task } from './types';

export type TaskStatus = 'overdue' | 'due-soon' | 'normal' | 'no-date';

/**
 * Determines the status of a task based on its due date
 */
export function getTaskStatus(task: Task): TaskStatus {
  if (!task.dueDate) return 'no-date';
  if (isOverdue(task.dueDate)) return 'overdue';
  if (isDueSoon(task.dueDate)) return 'due-soon';
  return 'normal';
}

/**
 * Returns CSS classes for task item styling based on status
 */
export function getTaskItemStyles(status: TaskStatus): {
  container: string;
  text: string;
} {
  const baseContainer = 'flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all group';
  const baseText = 'font-medium text-base block';

  const styles = {
    overdue: {
      container: `${baseContainer} bg-gradient-to-r from-red-50 to-red-50 border border-red-200`,
      text: `${baseText} text-gray-900`,
    },
    'due-soon': {
      container: `${baseContainer} bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200`,
      text: `${baseText} text-gray-900`,
    },
    normal: {
      container: `${baseContainer} bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-gray-200`,
      text: `${baseText} text-gray-800`,
    },
    'no-date': {
      container: `${baseContainer} bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-gray-200`,
      text: `${baseText} text-gray-800`,
    },
  };

  return styles[status];
}

/**
 * Returns badge styling and text based on status
 */
export function getTaskBadge(
  status: TaskStatus,
  daysUntilDue: number | null
): {
  className: string;
  icon: string;
  text: string;
} {
  const baseBadge = 'text-xs font-medium mt-1 block';

  const badges = {
    overdue: {
      className: `${baseBadge} text-red-600 bg-red-100 px-2 py-1 rounded-md w-fit`,
      icon: '⚠️',
      text: `Overdue`,
    },
    'due-soon': {
      className: `${baseBadge} text-orange-600 bg-orange-100 px-2 py-1 rounded-md w-fit`,
      icon: '⏰',
      text: `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`,
    },
    normal: {
      className: `${baseBadge} text-gray-500`,
      icon: '📅',
      text: 'Due',
    },
    'no-date': {
      className: `${baseBadge} text-gray-400`,
      icon: '',
      text: '',
    },
  };

  return badges[status];
}
