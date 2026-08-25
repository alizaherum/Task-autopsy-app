import { useState } from 'react'
import type { Reflection, Task } from '../types'
import { ReflectionModal } from './ReflectionModal'

interface Props {
  tasks: Task[]
  onComplete: (id: string, reflection: Reflection) => void
  onDelete: (id: string) => void
}

function daysSince(dateStr: string) {
  return Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)))
}

export function TaskList({ tasks, onComplete, onDelete }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const pending = tasks.filter((t) => !t.completedAt)

  if (pending.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
        Nothing on the pile right now. Add something you've been putting off.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {pending.map((task) => {
        const days = daysSince(task.createdAt)
        return (
          <div
            key={task.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-100">{task.title}</p>
              {task.notes && <p className="mt-0.5 text-sm text-slate-500">{task.notes}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {days === 0 ? 'added today' : `waiting ${days} ${days === 1 ? 'day' : 'days'}`}
                </span>
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setActiveTask(task)}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-500"
              >
                Finally did it
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
        )
      })}

      {activeTask && (
        <ReflectionModal
          task={activeTask}
          onCancel={() => setActiveTask(null)}
          onSubmit={(reflection) => {
            onComplete(activeTask.id, reflection)
            setActiveTask(null)
          }}
        />
      )}
    </div>
  )
}
