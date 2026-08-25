import { TRIGGERS, type Task } from '../types'

interface Props {
  tasks: Task[]
}

export function HistoryList({ tasks }: Props) {
  const completed = tasks
    .filter((t) => t.completedAt && t.reflection)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  if (completed.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">
        Completed tasks with their reflections will show up here.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {completed.map((task) => {
        const label = TRIGGERS.find((t) => t.value === task.reflection!.trigger)?.label
        return (
          <div
            key={task.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-slate-100 line-through decoration-slate-600">
                {task.title}
              </p>
              <span className="shrink-0 rounded-full bg-teal-500/10 px-2 py-0.5 text-xs text-teal-300">
                {task.reflection!.trigger === 'other' && task.reflection!.otherTrigger
                  ? task.reflection!.otherTrigger
                  : label}
              </span>
            </div>
            {task.reflection!.notes && (
              <p className="mt-1 text-sm text-slate-500">{task.reflection!.notes}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
