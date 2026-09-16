export function formatHour(hour: number): string {
  const h = Math.round(hour) % 24
  const period = h < 12 ? 'am' : 'pm'
  const display = h % 12 === 0 ? 12 : h % 12
  return `${display}${period}`
}
