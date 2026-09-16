import { useMemo, useState } from 'react'
import type { EnergyCheckIn, Task } from '../types'
import { LOADS } from '../types'
import { recommendNow } from '../lib/recommend'
import { LOAD_COLOR } from '../lib/style'
import { EnergyCheckInWidget } from './EnergyCheckIn'
import { CompleteModal } from './CompleteModal'

interface Props {
  tasks: Task[]
  checkIns: EnergyCheckIn[]
  onLogEnergy: (level: number) => void
  onComplete: (id: string, focusRating: number, energyAtCompletion: number) => void
}

export function NowPanel({ tasks, checkIns, onLogEnergy, onComplete }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [now] = useState(() => new Date())

  const recommendation = useMemo(() => recommendNow(tasks, checkIns, now), [tasks, checkIns, now])
  const topLoadLabel = LOADS.find((l) => l.value === recommendation.topLoad)?.label ?? recommendation.topLoad

  const pending = tasks.filter((t) => !t.completedAt)
  const matching = pending.filter((t) => t.load === recommendation.topLoad)
  const others = pending.filter((t) => t.load !== recommendation.topLoad)

  const personalized = recommendation.loadScores[0].confidence > 0.35

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl border p-5"
        style={{ borderColor: LOAD_COLOR[recommendation.topLoad], background: `${LOAD_COLOR[recommendation.topLoad]}14` }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Right now
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: personalized ? 'rgba(28,163,28,0.15)' : 'rgba(148,163,184,0.15)', color: personalized ? '#4ade80' : '#94a3b8' }}
          >
            {personalized ? 'Personalized' : 'General pattern'}
          </span>
        </div>
        <p className="mt-2 text-2xl font-semibold text-slate-50">
          Try <span style={{ color: LOAD_COLOR[recommendation.topLoad] }}>{topLoadLabel}</span> work
        </p>
        <p className="mt-1.5 text-sm text-slate-300">{recommendation.reason}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span>Predicted energy: {recommendation.predictedEnergy.level.toFixed(1)}/5</span>
          <div className="h-1.5 flex-1 max-w-[120px] overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${(recommendation.predictedEnergy.level / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <EnergyCheckInWidget checkIns={checkIns} onLog={onLogEnergy} />

      <section>
        <h3 className="mb-2 text-sm font-semibold text-slate-200">
          {matching.length > 0 ? `Matching ${topLoadLabel.toLowerCase()} tasks` : 'No matching tasks yet'}
        </h3>
        {matching.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">
            Add a {topLoadLabel.toLowerCase()} task in the Backlog tab, or work on something below.
          </p>
        )}
        <div className="space-y-2">
          {matching.map((task) => (
            <TaskRow key={task.id} task={task} onClick={() => setActiveTask(task)} />
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-slate-500">Other backlog items</h3>
          <div className="space-y-2 opacity-70">
            {others.map((task) => (
              <TaskRow key={task.id} task={task} onClick={() => setActiveTask(task)} />
            ))}
          </div>
        </section>
      )}

      {activeTask && (
        <CompleteModal
          task={activeTask}
          suggestedEnergy={recommendation.predictedEnergy.level}
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

function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: LOAD_COLOR[task.load] }} />
        <p className="truncate font-medium text-slate-100">{task.title}</p>
      </div>
      <button
        onClick={onClick}
        className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
      >
        Complete
      </button>
    </div>
  )
}
