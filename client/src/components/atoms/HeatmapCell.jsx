import { Link } from 'react-router'

const BASE = 'block size-3.5 shrink-0 rounded-sm'

// One day in the year heatmap. Filled days are links to that postcard;
// empty days are plain squares hidden from screen readers (the heatmap's
// own label summarises them).
export default function HeatmapCell({ label, to, isToday = false, isFuture = false }) {
  const todayRing = isToday ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface' : ''

  if (isFuture) return <span aria-hidden="true" className={BASE} />

  if (to) {
    return (
      <Link
        to={to}
        aria-label={`${label}: open postcard`}
        title={label}
        className={`${BASE} ${todayRing} bg-primary-strong transition hover:bg-accent`}
      />
    )
  }

  return <span aria-hidden="true" title={label} className={`${BASE} ${todayRing} border border-primary/50 bg-bg`} />
}
