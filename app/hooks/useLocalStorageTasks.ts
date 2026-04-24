import { useState, useEffect } from 'react';
import type { Task } from '@/app/lib/types';

const STORAGE_KEY = 'life-admin-hub-tasks';

/**
 * useLocalStorageTasks
 * Custom hook for managing tasks with localStorage persistence
 * Automatically syncs state with localStorage
 */
export function useLocalStorageTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Initialize from localStorage (runs only once on mount)
    try {
      if (typeof window !== 'undefined') {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          return JSON.parse(storedTasks) as Task[];
        }
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    return [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      }
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  return { tasks, setTasks };
}
