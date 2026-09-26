// Postcard dates arrive from the API as 'YYYY-MM-DD'. Parse them as local
// calendar days; new Date('2026-05-12') would be read as UTC midnight and
// can show the previous day west of Greenwich.
export function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// The reverse: a local Date to 'YYYY-MM-DD', the same form the API uses.
export function toDateKey(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

// Monday of the week the date falls in (weeks run Monday to Sunday).
export function startOfWeek(date) {
  const mondayOffset = (date.getDay() + 6) % 7
  return addDays(date, -mondayOffset)
}

// Whole days from one 'YYYY-MM-DD' to another. UTC avoids daylight-saving
// days that are 23 or 25 hours long.
export function daysBetween(fromKey, toKey) {
  const utc = (key) => {
    const [y, m, d] = key.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((utc(toKey) - utc(fromKey)) / 86_400_000)
}

export function formatLongDate(date = new Date()) {
  return date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatPostcardDate(key) {
  return fromDateKey(key).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatMonth(date) {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}
