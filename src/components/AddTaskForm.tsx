import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { COMMON_TAGS, type Task } from '../types'

interface Props {
  onAdd: (task: Task) => void
}

export function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const inputId = useId()

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    onAdd({
      id: uuidv4(),
      title: trimmed,
      notes: notes.trim() || undefined,
      tags: selectedTags,
      createdAt: new Date().toISOString(),
    })

    setTitle('')
    setNotes('')
    setSelectedTags([])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/20"
    >
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-300">
        What are you avoiding?
      </label>
      <input
        id={inputId}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Reply to the client email"
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any context (optional)"
        rows={2}
        className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/20"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {COMMON_TAGS.map((tag) => {
          const active = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                active
                  ? 'border-violet-400/50 bg-violet-500/15 text-violet-200'
                  : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <button
        type="submit"
        disabled={!title.trim()}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-950/40 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Add to the pile
      </button>
    </form>
  )
}
