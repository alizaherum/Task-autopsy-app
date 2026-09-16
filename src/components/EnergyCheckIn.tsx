import { ENERGY_LEVELS, type EnergyCheckIn } from '../types'

interface Props {
  checkIns: EnergyCheckIn[]
  onLog: (level: number) => void
}

export function EnergyCheckInWidget({ checkIns, onLog }: Props) {
  const last = checkIns[0]
  const lastLabel = last
    ? ENERGY_LEVELS.find((l) => l.value === last.level)?.label
    : null

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-slate-200">How's your energy right now?</h3>
        {last && (
          <span className="text-xs text-slate-500">
            last logged: {lastLabel} · {timeAgo(last.timestamp)}
          </span>
        )}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {ENERGY_LEVELS.map((l) => (
          <button
            key={l.value}
            onClick={() => onLog(l.value)}
            className="flex flex-col items-center gap-1 rounded-lg border border-slate-700 py-2.5 text-slate-300 transition-colors hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-300"
            title={l.label}
          >
            <span className="text-lg">{l.emoji}</span>
            <span className="text-[10px] leading-tight">{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.round(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}
