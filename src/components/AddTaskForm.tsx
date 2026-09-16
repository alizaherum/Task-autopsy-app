import { useId, useState } from 'react'
import { LOADS, type CognitiveLoad, type Task } from '../types'
import { LOAD_COLOR } from '../lib/style'

interface Props {
  onAdd: (task: Task) => void
}

export function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [load, setLoad] = useState<CognitiveLoad>('deep')
  const inputId = useId()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    onAdd({
      id: crypto.randomUUID(),
      title: trimmed,
      load,
      createdAt: new Date().toISOString(),
    })

    setTitle('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
    >
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-300">
        Add a task
      </label>
      <input
        id={inputId}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Draft the Q3 proposal outline"
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {LOADS.map((l) => {
          const active = load === l.value
          return (
            <button
              key={l.value}
              type="button"
              onClick={() => setLoad(l.value)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors"
              style={
                active
                  ? { borderColor: LOAD_COLOR[l.value], color: LOAD_COLOR[l.value], background: `${LOAD_COLOR[l.value]}1a` }
                  : { borderColor: '#334155', color: '#94a3b8' }
              }
              title={l.description}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: LOAD_COLOR[l.value] }}
              />
              {l.label}
            </button>
          )
        })}
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        Add to backlog
      </button>
    </form>
  )
}
