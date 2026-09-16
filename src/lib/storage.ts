import { useCallback, useEffect, useState } from 'react'
import type { EnergyCheckIn, Task } from '../types'

const TASKS_KEY = 'energy-scheduler:tasks'
const CHECKINS_KEY = 'energy-scheduler:checkins'

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => load<Task>(TASKS_KEY))

  useEffect(() => {
    save(TASKS_KEY, tasks)
  }, [tasks])

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev])
  }, [])

  const completeTask = useCallback(
    (id: string, focusRating: number, energyAtCompletion: number) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completedAt: new Date().toISOString(), focusRating, energyAtCompletion }
            : t,
        ),
      )
    },
    [],
  )

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { tasks, addTask, completeTask, deleteTask }
}

export function useEnergyCheckIns() {
  const [checkIns, setCheckIns] = useState<EnergyCheckIn[]>(() => load<EnergyCheckIn>(CHECKINS_KEY))

  useEffect(() => {
    save(CHECKINS_KEY, checkIns)
  }, [checkIns])

  const logEnergy = useCallback((level: number) => {
    setCheckIns((prev) => [
      { id: crypto.randomUUID(), timestamp: new Date().toISOString(), level },
      ...prev,
    ])
  }, [])

  return { checkIns, logEnergy }
}
