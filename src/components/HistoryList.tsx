import { TRIGGERS, type Task } from '../types'
import { TRIGGER_ICONS } from '../lib/triggerIcons'

interface Props {
  tasks: Task[]
}

export function HistoryList({ tasks }: Props) {
  const completed = tasks
    .filter((t) => t.completedAt && t.reflection)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  if (completed.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700/60 p-8 text-center text-sm text-slate-500">
        Completed tasks with their reflections will show up here.
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {completed.map((task) => {
        const label = TRIGGERS.find((t) => t.value === task.reflection!.trigger)?.label
        const Icon = TRIGGER_ICONS[task.reflection!.trigger]
        return (
          <div
            key={task.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-lg shadow-black/10"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-slate-300 line-through decoration-slate-600">
                {task.title}
              </p>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-300">
                <Icon className="h-3.5 w-3.5" />
                {task.reflection!.trigger === 'other' && task.reflection!.otherTrigger
                  ? task.reflection!.otherTrigger
                  : label}
              </span>
            </div>
            {task.reflection!.notes && (
              <p className="mt-1.5 text-sm text-slate-500">{task.reflection!.notes}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
