import { Sparkles, Trash2 } from 'lucide-react'
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
      <div className="rounded-2xl border border-dashed border-slate-700/60 p-8 text-center text-sm text-slate-500">
        Nothing on the pile right now. Add something you've been putting off.
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {pending.map((task) => {
        const days = daysSince(task.createdAt)
        return (
          <div
            key={task.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-lg shadow-black/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-100">{task.title}</p>
                {task.notes && <p className="mt-0.5 text-sm text-slate-500">{task.notes}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    {days === 0 ? 'added today' : `waiting ${days} ${days === 1 ? 'day' : 'days'}`}
                  </span>
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onDelete(task.id)}
                className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete task"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setActiveTask(task)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-amber-950/20 transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              Finally did it
            </button>
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
