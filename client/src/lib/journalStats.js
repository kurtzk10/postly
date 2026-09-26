import { daysBetween, formatMonth, fromDateKey } from './dates.js'

// The extra numbers in the /streaks "Journaling stats" list. The streak
// numbers themselves come from GET /api/stats; these are worked out here
// from the postcards list, so they update the moment a postcard is saved
// or deleted. Nothing is stored.
export function journalStats(postcards, todayKey) {
  if (postcards.length === 0) return null

  const keys = postcards.map((p) => p.date).sort()
  const firstKey = keys[0]
  const madeToday = keys.includes(todayKey)

  // Best month: the calendar month with the most postcards.
  const perMonth = new Map()
  for (const key of keys) {
    const month = key.slice(0, 7) // 'YYYY-MM'
    perMonth.set(month, (perMonth.get(month) ?? 0) + 1)
  }
  const [bestMonthKey, bestMonthCount] = [...perMonth].reduce((best, entry) => (entry[1] > best[1] ? entry : best))

  // Days since the first postcard. Today only counts once it's been made,
  // so the morning doesn't already show a "missed" day.
  const daysSoFar = daysBetween(firstKey, todayKey) + (madeToday ? 1 : 0)
  const weeks = Math.max(daysSoFar, 1) / 7

  return {
    bestMonth: { label: formatMonth(fromDateKey(`${bestMonthKey}-01`)), count: bestMonthCount },
    averagePerWeek: Math.min(postcards.length / weeks, 7),
    daysMissed: Math.max(daysSoFar - postcards.length, 0),
  }
}
