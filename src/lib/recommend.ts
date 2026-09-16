import type { CognitiveLoad, EnergyCheckIn, Task } from '../types'
import { LOADS } from '../types'

/**
 * Personalization engine.
 *
 * Instead of a fixed timetable, every prediction is a kernel-weighted average
 * over the user's own history: each past data point votes on "now" weighted by
 * (a) how close its hour-of-day is to the current hour, wrapped around the
 * 24h clock, and (b) how recent it is (older data fades but never disappears).
 * With little or no history the model falls back to a generic circadian
 * prior, then blends toward the learned estimate as data accumulates —
 * so recommendations start sensible on day one and get more personal over time.
 */

const HOUR_SIGMA = 2.5 // hours; how narrowly a data point's "vote" is scoped to nearby hours
const RECENCY_HALF_LIFE_DAYS = 21 // a data point's influence halves every 3 weeks
const MIN_SAMPLES_FOR_CONFIDENCE = 6 // effective sample weight at which we trust learned data fully

// Generic circadian energy curve (1-5) used before personal data exists.
// Modest morning rise, post-lunch dip, late-afternoon recovery, evening decline.
const DEFAULT_CURVE: number[] = [
  1.8, 1.6, 1.5, 1.5, 1.6, 1.9, // 0-5
  2.4, 3.0, 3.6, 4.0, 4.2, 4.0, // 6-11
  3.3, 2.9, 3.1, 3.5, 3.7, 3.6, // 12-17
  3.3, 3.0, 2.7, 2.4, 2.1, 1.9, // 18-23
]

const IDEAL_ENERGY: Record<CognitiveLoad, number> = {
  deep: 4.6,
  shallow: 3,
  admin: 2,
}

export function hourOfDay(date: Date): number {
  return date.getHours() + date.getMinutes() / 60
}

function circularHourDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 24
  return Math.min(diff, 24 - diff)
}

function gaussianWeight(distanceHours: number, sigma = HOUR_SIGMA): number {
  return Math.exp(-(distanceHours * distanceHours) / (2 * sigma * sigma))
}

function recencyWeight(timestamp: string, now: Date, halfLifeDays = RECENCY_HALF_LIFE_DAYS): number {
  const daysAgo = Math.max(0, (now.getTime() - new Date(timestamp).getTime()) / 86_400_000)
  return Math.pow(0.5, daysAgo / halfLifeDays)
}

export interface EnergyPrediction {
  level: number
  /** 0-1, how much of the estimate comes from personal data vs. the generic prior */
  confidence: number
  sampleWeight: number
}

/** Predicts energy level (1-5) for a given hour, blending personal history with a generic prior. */
export function predictEnergy(
  checkIns: EnergyCheckIn[],
  targetHour: number,
  now: Date = new Date(),
): EnergyPrediction {
  let weightedSum = 0
  let totalWeight = 0

  for (const c of checkIns) {
    const checkInHour = hourOfDay(new Date(c.timestamp))
    const w = gaussianWeight(circularHourDistance(checkInHour, targetHour)) * recencyWeight(c.timestamp, now)
    weightedSum += w * c.level
    totalWeight += w
  }

  const learnedLevel = totalWeight > 0 ? weightedSum / totalWeight : null
  const prior = DEFAULT_CURVE[Math.floor(targetHour) % 24]
  const confidence = Math.min(1, totalWeight / MIN_SAMPLES_FOR_CONFIDENCE)

  const level = learnedLevel === null ? prior : confidence * learnedLevel + (1 - confidence) * prior

  return { level, confidence, sampleWeight: totalWeight }
}

/** 24 hourly predictions (hour 0 .. 23) for the energy-by-time-of-day heatmap. */
export function predictEnergyCurve(checkIns: EnergyCheckIn[], now: Date = new Date()): EnergyPrediction[] {
  return Array.from({ length: 24 }, (_, hour) => predictEnergy(checkIns, hour, now))
}

export interface LoadScore {
  load: CognitiveLoad
  score: number // 0-1
  confidence: number // 0-1, share of the score coming from personal history
  sampleCount: number
  avgFocusRating: number | null
}

/**
 * Scores each cognitive-load type for how well it fits the current/target slot.
 * Blends a generic "match this energy level to this kind of work" heuristic with
 * the user's own logged focus ratings for tasks completed in similar slots.
 */
export function scoreLoads(
  tasks: Task[],
  predictedEnergy: number,
  targetHour: number,
  now: Date = new Date(),
): LoadScore[] {
  const completed = tasks.filter(
    (t) => t.completedAt && t.focusRating != null && t.energyAtCompletion != null,
  )

  return LOADS.map(({ value: load }) => {
    let weightedRatingSum = 0
    let totalWeight = 0
    let sampleCount = 0

    for (const t of completed) {
      if (t.load !== load) continue
      const completedHour = hourOfDay(new Date(t.completedAt!))
      const w = gaussianWeight(circularHourDistance(completedHour, targetHour)) * recencyWeight(t.completedAt!, now)
      weightedRatingSum += w * t.focusRating!
      totalWeight += w
      sampleCount += 1
    }

    const heuristic = 1 - Math.abs(predictedEnergy - IDEAL_ENERGY[load]) / 4 // 0-1
    const learned = totalWeight > 0 ? (weightedRatingSum / totalWeight - 1) / 4 : null // 1-5 -> 0-1
    const confidence = Math.min(1, totalWeight / MIN_SAMPLES_FOR_CONFIDENCE)
    const score = learned === null ? heuristic : confidence * learned + (1 - confidence) * heuristic

    return {
      load,
      score,
      confidence,
      sampleCount,
      avgFocusRating: totalWeight > 0 ? weightedRatingSum / totalWeight : null,
    }
  }).sort((a, b) => b.score - a.score)
}

export interface Recommendation {
  predictedEnergy: EnergyPrediction
  loadScores: LoadScore[]
  topLoad: CognitiveLoad
  reason: string
}

export function recommendNow(tasks: Task[], checkIns: EnergyCheckIn[], now: Date = new Date()): Recommendation {
  const targetHour = hourOfDay(now)
  const predictedEnergy = predictEnergy(checkIns, targetHour, now)
  const loadScores = scoreLoads(tasks, predictedEnergy.level, targetHour, now)
  const top = loadScores[0]

  const loadLabel = LOADS.find((l) => l.value === top.load)?.label ?? top.load
  const personalized = top.confidence > 0.35 && top.sampleCount > 0
  const energyWord = predictedEnergy.level >= 3.7 ? 'high' : predictedEnergy.level >= 2.6 ? 'moderate' : 'low'

  const reason = personalized
    ? `Your energy tends to run ${energyWord} around this time, and ${loadLabel.toLowerCase()} work has gone well for you in similar slots before (avg focus ${top.avgFocusRating?.toFixed(1)}/5 over ${top.sampleCount} sessions).`
    : `Your energy tends to run ${energyWord} around this time, which typically suits ${loadLabel.toLowerCase()} work best. Log a few completed tasks to personalize this.`

  return { predictedEnergy, loadScores, topLoad: top.load, reason }
}

export interface BestHour {
  load: CognitiveLoad
  hour: number
  score: number
}

/** For each cognitive load, finds the hour of day where its fit score peaks. */
export function bestHours(tasks: Task[], checkIns: EnergyCheckIn[], now: Date = new Date()): BestHour[] {
  return LOADS.map(({ value: load }) => {
    let best = { hour: 0, score: -Infinity }
    for (let hour = 0; hour < 24; hour++) {
      const predicted = predictEnergy(checkIns, hour, now)
      const score = scoreLoads(tasks, predicted.level, hour, now).find((s) => s.load === load)!.score
      if (score > best.score) best = { hour, score }
    }
    return { load, hour: best.hour, score: best.score }
  })
}
