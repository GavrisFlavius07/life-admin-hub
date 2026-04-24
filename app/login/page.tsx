"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Login failed');
        return;
      }

      // Save token to localStorage as fallback (cookie httpOnly already set)
      if (data.token) localStorage.setItem('token', data.token);

      router.push('/dashboard');
    } catch (err) {
      setError('Network error');
    }
  }

  // If already logged in, redirect to dashboard
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.ok) router.replace('/dashboard');
      } catch (e) {
        // no-op
      }
    })();
    return () => { mounted = false };
  }, [router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <label className="block mb-2">
          <span className="text-sm text-gray-700">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 block w-full border rounded px-3 py-2" />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-gray-700">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 block w-full border rounded px-3 py-2" />
        </label>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
      </form>
    </div>
  );
}
