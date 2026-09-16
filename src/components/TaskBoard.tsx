import { useState } from 'react'
import { LOADS, type Task } from '../types'
import { LOAD_COLOR } from '../lib/style'
import { CompleteModal } from './CompleteModal'

interface Props {
  tasks: Task[]
  currentEnergy: number
  onComplete: (id: string, focusRating: number, energyAtCompletion: number) => void
  onDelete: (id: string) => void
}

export function TaskBoard({ tasks, currentEnergy, onComplete, onDelete }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const pending = tasks.filter((t) => !t.completedAt)

  if (pending.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
        Backlog is empty. Add a task and tag it with the kind of effort it needs.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {LOADS.map((l) => {
        const group = pending.filter((t) => t.load === l.value)
        if (group.length === 0) return null
        return (
          <section key={l.value}>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: LOAD_COLOR[l.value] }} />
              {l.label} · {group.length}
            </h3>
            <div className="space-y-2">
              {group.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <p className="min-w-0 font-medium text-slate-100">{task.title}</p>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => setActiveTask(task)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="rounded-lg border border-slate-700 px-2 py-1.5 text-sm text-slate-400 hover:border-red-500 hover:text-red-400"
                      aria-label="Delete task"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {activeTask && (
        <CompleteModal
          task={activeTask}
          suggestedEnergy={currentEnergy}
          onCancel={() => setActiveTask(null)}
          onSubmit={(rating, energy) => {
            onComplete(activeTask.id, rating, energy)
            setActiveTask(null)
          }}
        />
      )}
    </div>
  )
}
