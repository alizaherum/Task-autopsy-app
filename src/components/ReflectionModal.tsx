import { useMemo, useState } from 'react'
import { TRIGGERS, type Reflection, type Task, type Trigger } from '../types'

interface Props {
  task: Task
  onCancel: () => void
  onSubmit: (reflection: Reflection) => void
}

export function ReflectionModal({ task, onCancel, onSubmit }: Props) {
  const [trigger, setTrigger] = useState<Trigger | null>(null)
  const [otherTrigger, setOtherTrigger] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!trigger) return
    onSubmit({
      trigger,
      otherTrigger: trigger === 'other' ? otherTrigger.trim() || undefined : undefined,
      notes: notes.trim() || undefined,
      reflectedAt: new Date().toISOString(),
    })
  }

  const delayDays = useMemo(
    () =>
      Math.max(
        0,
        Math.round((Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      ),
    [task.createdAt],
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-slate-100">You finally did it 🎉</h2>
        <p className="mt-1 text-sm text-slate-400">
          "{task.title}"
          {delayDays > 0 && (
            <span>
              {' '}
              — sat for <span className="text-slate-300">{delayDays}</span>{' '}
              {delayDays === 1 ? 'day' : 'days'}.
            </span>
          )}
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-300">What triggered the delay?</p>
          <div className="grid grid-cols-1 gap-2">
            {TRIGGERS.map((t) => (
              <label
                key={t.value}
                className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  trigger === t.value
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="trigger"
                  value={t.value}
                  checked={trigger === t.value}
                  onChange={() => setTrigger(t.value)}
                  className="mt-0.5 accent-teal-500"
                />
                <span>
                  <span className="block font-medium text-slate-200">{t.label}</span>
                  <span className="block text-xs text-slate-500">{t.description}</span>
                </span>
              </label>
            ))}
          </div>

          {trigger === 'other' && (
            <input
              value={otherTrigger}
              onChange={(e) => setOtherTrigger(e.target.value)}
              placeholder="What was it?"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else worth remembering? (optional)"
            rows={2}
            className="mt-3 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!trigger}
              className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              Save reflection
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
