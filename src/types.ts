export type Trigger =
  | 'fear'
  | 'boredom'
  | 'unclear-steps'
  | 'overwhelm'
  | 'perfectionism'
  | 'low-energy'
  | 'other'

export const TRIGGERS: { value: Trigger; label: string; description: string }[] = [
  { value: 'fear', label: 'Fear', description: 'Afraid of doing it wrong, being judged, or the outcome' },
  { value: 'boredom', label: 'Boredom', description: 'Just didn’t feel interesting enough to start' },
  { value: 'unclear-steps', label: 'Unclear first step', description: 'Didn’t know where or how to begin' },
  { value: 'overwhelm', label: 'Overwhelm', description: 'Felt too big or complex to tackle' },
  { value: 'perfectionism', label: 'Perfectionism', description: 'Wanted conditions or a plan to be just right first' },
  { value: 'low-energy', label: 'Low energy', description: 'Tired, drained, or not in the right headspace' },
  { value: 'other', label: 'Other', description: 'Something else entirely' },
]

export interface Task {
  id: string
  title: string
  notes?: string
  tags: string[]
  createdAt: string
  completedAt?: string
  reflection?: Reflection
}

export interface Reflection {
  trigger: Trigger
  otherTrigger?: string
  notes?: string
  reflectedAt: string
}

export const COMMON_TAGS = [
  'no clear first step',
  'high stakes',
  'boring',
  'creative',
  'admin',
  'social',
  'physical',
]
