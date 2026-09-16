export type CognitiveLoad = 'deep' | 'shallow' | 'admin'

export const LOADS: { value: CognitiveLoad; label: string; description: string }[] = [
  { value: 'deep', label: 'Deep', description: 'Focused, hard-to-interrupt work' },
  { value: 'shallow', label: 'Shallow', description: 'Easy, low-stakes busywork' },
  { value: 'admin', label: 'Admin', description: 'Logistics, replies, chores' },
]

export interface Task {
  id: string
  title: string
  load: CognitiveLoad
  createdAt: string
  completedAt?: string
  /** Self-reported 1-5: how well the work session went */
  focusRating?: number
  /** Predicted or logged energy level (1-5) at the moment of completion */
  energyAtCompletion?: number
}

export interface EnergyCheckIn {
  id: string
  timestamp: string
  level: number
}

export const ENERGY_LEVELS: { value: number; label: string; emoji: string }[] = [
  { value: 1, label: 'Running on empty', emoji: '🪫' },
  { value: 2, label: 'Low', emoji: '😮‍💨' },
  { value: 3, label: 'Steady', emoji: '🙂' },
  { value: 4, label: 'Good', emoji: '⚡' },
  { value: 5, label: 'Sharp', emoji: '🔥' },
]
