import { useState } from 'react'
import type { Task } from '../types'

interface Props {
  task: Task
  suggestedEnergy: number
  onCancel: () => void
  onSubmit: (focusRating: number, energyAtCompletion: number) => void
}

const RATING_LABELS = ['Rough', 'Meh', 'Okay', 'Good', 'Great']

export function CompleteModal({ task, suggestedEnergy, onCancel, onSubmit }: Props) {
  const [rating, setRating] = useState<number | null>(null)
  const [energy, setEnergy] = useState(Math.round(suggestedEnergy))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-slate-100">Nice work</h2>
        <p className="mt-1 text-sm text-slate-400">"{task.title}"</p>

        <p className="mt-4 mb-2 text-sm font-medium text-slate-300">How did that session go?</p>
        <div className="grid grid-cols-5 gap-2">
          {RATING_LABELS.map((label, i) => {
            const value = i + 1
            return (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                  rating === value
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <p className="mt-4 mb-2 text-sm font-medium text-slate-300">
          Energy level during the session
        </p>
        <input
          type="range"
          min={1}
          max={5}
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Empty</span>
          <span>Sharp</span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-500"
          >
            Cancel
          </button>
          <button
            disabled={rating === null}
            onClick={() => rating !== null && onSubmit(rating, energy)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
