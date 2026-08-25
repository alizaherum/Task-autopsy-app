import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Reflection, Task } from '../types'

interface TaskRow {
  id: string
  user_id: string
  title: string
  notes: string | null
  tags: string[]
  created_at: string
  completed_at: string | null
  reflection: Reflection | null
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes ?? undefined,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
    reflection: row.reflection ?? undefined,
  }
}

export function useSupabaseTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    async function load() {
      const { data, error } = await supabase!
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!cancelled) {
        if (!error && data) setTasks((data as TaskRow[]).map(rowToTask))
        setLoading(false)
      }
    }

    load()

    const channel = supabase
      .channel(`tasks-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
        () => {
          load()
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase!.removeChannel(channel)
    }
  }, [userId])

  const addTask = useCallback(
    async (task: Task) => {
      if (!supabase) return
      const optimistic = task
      setTasks((prev) => [optimistic, ...prev])
      const { error } = await supabase.from('tasks').insert({
        id: task.id,
        user_id: userId,
        title: task.title,
        notes: task.notes ?? null,
        tags: task.tags,
        created_at: task.createdAt,
      })
      if (error) setTasks((prev) => prev.filter((t) => t.id !== task.id))
    },
    [userId],
  )

  const completeTask = useCallback(async (id: string, reflection: Reflection | undefined) => {
    if (!supabase) return
    const completedAt = new Date().toISOString()
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completedAt, reflection } : t)),
    )
    await supabase.from('tasks').update({ completed_at: completedAt, reflection }).eq('id', id)
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    if (!supabase) return
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }, [])

  return { tasks, loading, addTask, completeTask, deleteTask }
}
