import { useCallback, useEffect, useState } from 'react'
import type { Task } from './types'

const STORAGE_KEY = 'task-autopsy:tasks'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev])
  }, [])

  const completeTask = useCallback((id: string, reflection: Task['reflection']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completedAt: new Date().toISOString(), reflection } : t,
      ),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { tasks, addTask, completeTask, deleteTask }
}
