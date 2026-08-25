import { useState } from 'react'
import { AddTaskForm } from './components/AddTaskForm'
import { HistoryList } from './components/HistoryList'
import { PatternInsights } from './components/PatternInsights'
import { TaskList } from './components/TaskList'
import { useTasks } from './storage'

type Tab = 'pile' | 'history' | 'insights'

const TABS: { id: Tab; label: string }[] = [
  { id: 'pile', label: 'The Pile' },
  { id: 'history', label: 'History' },
  { id: 'insights', label: 'Patterns' },
]

function App() {
  const { tasks, addTask, completeTask, deleteTask } = useTasks()
  const [tab, setTab] = useState<Tab>('pile')

  const pendingCount = tasks.filter((t) => !t.completedAt).length

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

        <nav className="mb-6 flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
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
          {tab === 'pile' && (
            <div className="space-y-6">
              <AddTaskForm onAdd={addTask} />
              <TaskList tasks={tasks} onComplete={completeTask} onDelete={deleteTask} />
            </div>
          )}
          {tab === 'history' && <HistoryList tasks={tasks} />}
          {tab === 'insights' && <PatternInsights tasks={tasks} />}
        </main>
      </div>
    </div>
  )
}

export default App
