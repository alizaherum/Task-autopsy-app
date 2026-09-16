import type { EnergyCheckIn, Task } from '../types'
import { LOADS } from '../types'
import { bestHours } from '../lib/recommend'
import { LOAD_COLOR } from '../lib/style'
import { formatHour } from '../lib/time'

interface Props {
  tasks: Task[]
  checkIns: EnergyCheckIn[]
}

export function LoadFitChart({ tasks, checkIns }: Props) {
  const completed = tasks.filter((t) => t.completedAt && t.focusRating != null)
  const best = bestHours(tasks, checkIns)

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="mb-3 text-sm font-semibold text-slate-200">Best time slot per task type</h3>
      <div className="space-y-3">
        {LOADS.map((l) => {
          const sessions = completed.filter((t) => t.load === l.value)
          const avg =
            sessions.length > 0
              ? sessions.reduce((s, t) => s + t.focusRating!, 0) / sessions.length
              : null
          const peak = best.find((b) => b.load === l.value)!
          return (
            <div key={l.value} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm text-slate-300">{l.label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(4, peak.score * 100)}%`, background: LOAD_COLOR[l.value] }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-xs text-slate-500">
                best ~{formatHour(peak.hour)}
              </span>
              <span className="w-20 shrink-0 text-right text-xs text-slate-500">
                {avg !== null ? `${avg.toFixed(1)}/5 · ${sessions.length}` : 'no data'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
