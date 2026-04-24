'use client';

import { useState } from 'react';

interface TaskInputProps {
  onAddTask: (taskText: string, dueDate?: Date) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim().length === 0) return;

    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    onAddTask(input.trim(), dueDateObj);
    setInput('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="taskInput" className="sr-only">Add task</label>
      <div className="flex gap-2">
        <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-md overflow-hidden">
          <span className="px-3 text-dark-400">📝</span>
          <input
            id="taskInput"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you need to do?"
            className="flex-1 px-2 py-2 outline-none text-sm text-black"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          Add
        </button>
      </div>

      <div className="mt-3">
        <label htmlFor="dueDate" className="text-sm text-gray-600">Due date (optional)</label>
        
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 overflow-hidden"
        />
      </div>
    </form>
  );
}
