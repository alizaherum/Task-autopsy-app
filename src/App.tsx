import { useState } from 'react'
import { useAuth } from './auth/AuthContext'
import { AddTaskForm } from './components/AddTaskForm'
import { AuthForm } from './components/AuthForm'
import { HistoryList } from './components/HistoryList'
import { PatternInsights } from './components/PatternInsights'
import { TaskList } from './components/TaskList'
import { useSupabaseTasks } from './data/useSupabaseTasks'
import { isSupabaseConfigured } from './lib/supabaseClient'

type Tab = 'pile' | 'history' | 'insights'

const TABS: { id: Tab; label: string }[] = [
  { id: 'pile', label: 'The Pile' },
  { id: 'history', label: 'History' },
  { id: 'insights', label: 'Patterns' },
]

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Task Autopsy
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Not just what you procrastinate on — why. Reflect after the fact, and let the
            pattern map do the rest.
          </p>
        </header>
        {children}
      </div>
    </div>
  )
}

function NotConfigured() {
  return (
    <Shell>
      <div className="rounded-xl border border-dashed border-slate-800 p-6 text-sm text-slate-400">
        <p className="font-medium text-slate-200">Supabase isn't configured yet.</p>
        <p className="mt-2">
          Create a free project at{' '}
          <span className="text-teal-400">supabase.com</span>, run{' '}
          <code className="rounded bg-slate-900 px-1 py-0.5 text-teal-300">
            supabase/schema.sql
          </code>{' '}
          in its SQL editor, then copy{' '}
          <code className="rounded bg-slate-900 px-1 py-0.5 text-teal-300">.env.example</code>{' '}
          to <code className="rounded bg-slate-900 px-1 py-0.5 text-teal-300">.env</code> and
          fill in your project URL and anon key.
        </p>
      </div>
    </Shell>
  )
}

function AuthenticatedApp({ userId, email }: { userId: string; email: string | undefined }) {
  const { signOut } = useAuth()
  const { tasks, loading, addTask, completeTask, deleteTask } = useSupabaseTasks(userId)
  const [tab, setTab] = useState<Tab>('pile')

  const pendingCount = tasks.filter((t) => !t.completedAt).length

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between text-sm text-slate-400">
        <span>Signed in as {email}</span>
        <button onClick={() => signOut()} className="text-teal-400 hover:text-teal-300">
          Sign out
        </button>
      </div>

      <nav className="mb-6 flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
            {t.id === 'pile' && pendingCount > 0 && (
              <span className="ml-1.5 text-xs opacity-80">({pendingCount})</span>
            )}
          </button>
        ))}
      </nav>

      <main>
        {loading ? (
          <p className="text-center text-sm text-slate-500">Loading…</p>
        ) : (
          <>
            {tab === 'pile' && (
              <div className="space-y-6">
                <AddTaskForm onAdd={addTask} />
                <TaskList tasks={tasks} onComplete={completeTask} onDelete={deleteTask} />
              </div>
            )}
            {tab === 'history' && <HistoryList tasks={tasks} />}
            {tab === 'insights' && <PatternInsights tasks={tasks} />}
          </>
        )}
      </main>
    </Shell>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (!isSupabaseConfigured) return <NotConfigured />

  if (loading) {
    return (
      <Shell>
        <p className="text-center text-sm text-slate-500">Loading…</p>
      </Shell>
    )
  }

  if (!user) {
    return (
      <Shell>
        <AuthForm />
      </Shell>
    )
  }

  return <AuthenticatedApp userId={user.id} email={user.email} />
}

export default App
