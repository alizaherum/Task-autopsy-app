import { useMemo, useState } from 'react'
import { TRIGGER_ICONS } from '../lib/triggerIcons'
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
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-[#141420] p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" />
        <h2 className="text-lg font-bold text-slate-100">You finally did it 🎉</h2>
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
            {TRIGGERS.map((t) => {
              const Icon = TRIGGER_ICONS[t.value]
              const selected = trigger === t.value
              return (
                <label
                  key={t.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                    selected
                      ? 'border-violet-400/50 bg-violet-500/10'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="trigger"
                    value={t.value}
                    checked={selected}
                    onChange={() => setTrigger(t.value)}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      selected ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-medium text-slate-200">{t.label}</span>
                    <span className="block text-xs text-slate-500">{t.description}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {trigger === 'other' && (
            <input
              value={otherTrigger}
              onChange={(e) => setOtherTrigger(e.target.value)}
              placeholder="What was it?"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
            />
          )}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else worth remembering? (optional)"
            rows={2}
            className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/25"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!trigger}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none"
            >
              Save reflection
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
