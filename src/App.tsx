import { useState } from 'react'
import { AddTaskForm } from './components/AddTaskForm'
import { TaskBoard } from './components/TaskBoard'
import { NowPanel } from './components/NowPanel'
import { EnergyHeatmap } from './components/EnergyHeatmap'
import { LoadFitChart } from './components/LoadFitChart'
import { StatCards } from './components/StatCards'
import { useEnergyCheckIns, useTasks } from './lib/storage'
import { predictEnergy, hourOfDay } from './lib/recommend'

type Tab = 'now' | 'backlog' | 'insights'

const TABS: { id: Tab; label: string }[] = [
  { id: 'now', label: 'Now' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'insights', label: 'Insights' },
]

function App() {
  const { tasks, addTask, completeTask, deleteTask } = useTasks()
  const { checkIns, logEnergy } = useEnergyCheckIns()
  const [tab, setTab] = useState<Tab>('now')

  const pendingCount = tasks.filter((t) => !t.completedAt).length
  const currentEnergy = predictEnergy(checkIns, hourOfDay(new Date())).level

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Energy-Matched Scheduler
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Tag tasks by cognitive load, log how your energy actually moves through the day,
            and let the app learn which kind of work fits which slot.
          </p>
        </header>

        <nav className="mb-6 flex gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
              {t.id === 'backlog' && pendingCount > 0 && (
                <span className="ml-1.5 text-xs opacity-80">({pendingCount})</span>
              )}
            </button>
          ))}
        </nav>

        <main>
          {tab === 'now' && (
            <NowPanel
              tasks={tasks}
              checkIns={checkIns}
              onLogEnergy={logEnergy}
              onComplete={completeTask}
            />
          )}
          {tab === 'backlog' && (
            <div className="space-y-6">
              <AddTaskForm onAdd={addTask} />
              <TaskBoard
                tasks={tasks}
                currentEnergy={currentEnergy}
                onComplete={completeTask}
                onDelete={deleteTask}
              />
            </div>
          )}
          {tab === 'insights' && (
            <div className="space-y-6">
              <StatCards tasks={tasks} checkIns={checkIns} />
              <EnergyHeatmap checkIns={checkIns} />
              <LoadFitChart tasks={tasks} checkIns={checkIns} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
