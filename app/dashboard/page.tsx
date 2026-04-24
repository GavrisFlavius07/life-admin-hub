"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    // remove local token fallback
    localStorage.removeItem('token');
    router.replace('/login');
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-red-600">Log out</button>
        </div>
        <p className="mt-4 text-gray-600">Protected area — only accessible when logged in.</p>
      </div>
    </div>
  );
}
