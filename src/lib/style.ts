import type { CognitiveLoad } from '../types'

export const LOAD_COLOR: Record<CognitiveLoad, string> = {
  deep: 'var(--load-deep)',
  shallow: 'var(--load-shallow)',
  admin: 'var(--load-admin)',
}

export function energyFill(level: number): string {
  const clamped = Math.max(0, Math.min(5, level))
  const alpha = 0.12 + (clamped / 5) * 0.78
  return `rgba(var(--energy-hue), ${alpha.toFixed(2)})`
}
