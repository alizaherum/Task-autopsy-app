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
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
    >
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-300">
        What are you avoiding?
      </label>
      <input
        id={inputId}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Reply to the client email"
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any context (optional)"
        rows={2}
        className="mt-3 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
                  ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
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
        className="mt-4 w-full rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        Add to the pile
      </button>
    </form>
  )
}
