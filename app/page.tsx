import TaskApp from './components/TaskApp';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Life Admin Hub</h1>
          <p className="mt-2 text-sm text-gray-600">A simple task manager to keep daily life organized.</p>
        </header>
        <TaskApp />
      </div>
    </main>
  );
}