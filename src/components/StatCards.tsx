import type { EnergyCheckIn, Task } from '../types'

interface Props {
  tasks: Task[]
  checkIns: EnergyCheckIn[]
}

export function StatCards({ tasks, checkIns }: Props) {
  const completed = tasks.filter((t) => t.completedAt)
  const days = new Set(checkIns.map((c) => c.timestamp.slice(0, 10))).size

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Energy check-ins" value={checkIns.length.toString()} />
      <StatCard label="Tasks completed" value={completed.length.toString()} />
      <StatCard label="Days of data" value={days.toString()} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold text-slate-100">{value}</p>
    </div>
  )
}
