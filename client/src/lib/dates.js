// Postcard dates arrive from the API as 'YYYY-MM-DD'. Parse them as local
// calendar days; new Date('2026-05-12') would be read as UTC midnight and
// can show the previous day west of Greenwich.
function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatLongDate(date = new Date()) {
  return date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatPostcardDate(key) {
  return fromDateKey(key).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
