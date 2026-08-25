import { TRIGGERS, type Task, type Trigger } from '../types'
import { TRIGGER_ICONS } from '../lib/triggerIcons'

interface Props {
  tasks: Task[]
}

function triggerLabel(trigger: Trigger) {
  return TRIGGERS.find((t) => t.value === trigger)?.label ?? trigger
}

function delayDays(task: Task) {
  if (!task.completedAt) return 0
  return Math.max(
    0,
    Math.round(
      (new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  )
}

export function PatternInsights({ tasks }: Props) {
  const completed = tasks.filter((t) => t.completedAt && t.reflection)

  if (completed.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700/60 p-8 text-center text-sm text-slate-500">
        No patterns yet. Once you finish a task and reflect on it, your map starts forming here.
      </div>
    )
  }

  const triggerCounts = new Map<Trigger, number>()
  for (const t of completed) {
    const trigger = t.reflection!.trigger
    triggerCounts.set(trigger, (triggerCounts.get(trigger) ?? 0) + 1)
  }
  const sortedTriggers = [...triggerCounts.entries()].sort((a, b) => b[1] - a[1])
  const topTrigger = sortedTriggers[0]
  const maxCount = sortedTriggers[0]?.[1] ?? 1

  // tag -> trigger -> count
  const tagTriggerCounts = new Map<string, Map<Trigger, number>>()
  for (const t of completed) {
    const trigger = t.reflection!.trigger
    for (const tag of t.tags) {
      if (!tagTriggerCounts.has(tag)) tagTriggerCounts.set(tag, new Map())
      const m = tagTriggerCounts.get(tag)!
      m.set(trigger, (m.get(trigger) ?? 0) + 1)
    }
  }

  const tagInsights = [...tagTriggerCounts.entries()]
    .map(([tag, triggerMap]) => {
      const total = [...triggerMap.values()].reduce((a, b) => a + b, 0)
      const [dominantTrigger, dominantCount] = [...triggerMap.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0]
      return { tag, total, dominantTrigger, dominantCount }
    })
    .filter((i) => i.total >= 2)
    .sort((a, b) => b.total - a.total)

  const avgDelay =
    completed.reduce((sum, t) => sum + delayDays(t), 0) / completed.length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Tasks autopsied" value={completed.length.toString()} />
        <StatCard
          label="Top trigger"
          value={topTrigger ? triggerLabel(topTrigger[0]) : '—'}
        />
        <StatCard label="Avg. delay" value={`${avgDelay.toFixed(1)}d`} />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Delay triggers</h3>
        <div className="space-y-3">
          {sortedTriggers.map(([trigger, count]) => {
            const Icon = TRIGGER_ICONS[trigger]
            return (
              <div key={trigger} className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-violet-300" />
                <span className="w-28 shrink-0 text-sm text-slate-400">
                  {triggerLabel(trigger)}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-5 shrink-0 text-right text-sm text-slate-500">{count}</span>
              </div>
            )
          })}
        </div>
      </section>

      {tagInsights.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Personal patterns</h3>
          <ul className="space-y-2.5">
            {tagInsights.map((i) => (
              <li key={i.tag} className="text-sm leading-relaxed text-slate-300">
                You stall most on{' '}
                <span className="font-medium text-violet-300">"{i.tag}"</span> tasks due to{' '}
                <span className="font-medium text-slate-100">
                  {triggerLabel(i.dominantTrigger)}
                </span>{' '}
                <span className="text-slate-500">
                  ({i.dominantCount}/{i.total} times)
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-lg font-bold text-slate-100">{value}</p>
    </div>
  )
}
