import { BarChart3, History, ListChecks, LogOut } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useAuth } from './auth/AuthContext'
import { AddTaskForm } from './components/AddTaskForm'
import { AuthForm } from './components/AuthForm'
import { HistoryList } from './components/HistoryList'
import { PatternInsights } from './components/PatternInsights'
import { TaskList } from './components/TaskList'
import { useSupabaseTasks } from './data/useSupabaseTasks'
import { isSupabaseConfigured } from './lib/supabaseClient'

type Tab = 'pile' | 'history' | 'insights'

const TABS: { id: Tab; label: string; icon: typeof ListChecks }[] = [
  { id: 'pile', label: 'Pile', icon: ListChecks },
  { id: 'history', label: 'History', icon: History },
  { id: 'insights', label: 'Patterns', icon: BarChart3 },
]

function Shell({ children, withNav }: { children: ReactNode; withNav?: boolean }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b14] text-slate-100">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-md px-4 pt-safe">
        <header className="pt-8 pb-6">
          <h1 className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Task Autopsy
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Not just what you procrastinate on — why.
          </p>
        </header>
        <main className={withNav ? 'pb-28' : 'pb-10'}>{children}</main>
      </div>
    </div>
  )
}

function NotConfigured() {
  return (
    <Shell>
      <div className="rounded-2xl border border-dashed border-slate-700/60 bg-white/[0.02] p-6 text-sm text-slate-400">
        <p className="font-semibold text-slate-200">Supabase isn't configured yet.</p>
        <p className="mt-2 leading-relaxed">
          Create a free project at <span className="text-violet-300">supabase.com</span>,
          run{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-violet-300">
            supabase/schema.sql
          </code>{' '}
          in its SQL editor, then copy{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 text-violet-300">
            .env.example
          </code>{' '}
          to <code className="rounded bg-white/5 px-1.5 py-0.5 text-violet-300">.env</code>{' '}
          and fill in your project URL and anon key.
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
    <Shell withNav>
      <div className="mb-5 flex items-center justify-between text-xs text-slate-500">
        <span className="truncate">Signed in as {email}</span>
        <button
          onClick={() => signOut()}
          className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>

      {loading ? (
        <p className="text-center text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          {tab === 'pile' && (
            <div className="space-y-5">
              <AddTaskForm onAdd={addTask} />
              <TaskList tasks={tasks} onComplete={completeTask} onDelete={deleteTask} />
            </div>
          )}
          {tab === 'history' && <HistoryList tasks={tasks} />}
          {tab === 'insights' && <PatternInsights tasks={tasks} />}
        </>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 pb-safe">
        <div className="mx-auto max-w-md px-4 pb-4">
          <div className="flex items-center justify-around rounded-2xl border border-white/10 bg-[#111119]/90 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-lg">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-colors ${
                    active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-violet-500/25 to-violet-500/5" />
                  )}
                  <Icon className="relative h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  <span className="relative">{t.label}</span>
                  {t.id === 'pile' && pendingCount > 0 && (
                    <span className="absolute top-1 right-[28%] flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-900">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>
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
