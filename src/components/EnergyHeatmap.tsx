import type { EnergyCheckIn } from '../types'
import { predictEnergyCurve } from '../lib/recommend'
import { energyFill } from '../lib/style'
import { formatHour } from '../lib/time'

interface Props {
  checkIns: EnergyCheckIn[]
}

export function EnergyHeatmap({ checkIns }: Props) {
  const curve = predictEnergyCurve(checkIns)

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Energy by time of day</h3>
        {checkIns.length === 0 && (
          <span className="text-xs text-slate-500">generic pattern — no check-ins yet</span>
        )}
      </div>
      <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0.5">
        {curve.map((p, hour) => (
          <div
            key={hour}
            className="group relative aspect-square rounded-sm"
            style={{ background: energyFill(p.level) }}
            title={`${formatHour(hour)}: ${p.level.toFixed(1)}/5 energy (${p.confidence > 0.35 ? 'personalized' : 'generic'})`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>12am</span>
      </div>
    </section>
  )
}
