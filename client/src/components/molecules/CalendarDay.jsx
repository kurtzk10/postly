import { Link } from 'react-router'
import { thumbnailUrl } from '../../lib/images.js'

// One day in the month calendar: the postcard's thumbnail when there is
// one (a link to it), otherwise just the day number.
export default function CalendarDay({ day, label, postcard, to, isToday = false, isFuture = false }) {
  const todayRing = isToday ? 'ring-2 ring-accent' : ''

  if (postcard) {
    return (
      <Link
        to={to}
        aria-label={`${label}: open postcard`}
        className={`relative block aspect-square overflow-hidden rounded-md ${todayRing} transition hover:opacity-90`}
      >
        <img src={thumbnailUrl(postcard.imageUrl)} alt="" className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute bottom-0.5 left-1 rounded bg-bg/85 px-1 text-small font-semibold">{day}</span>
      </Link>
    )
  }

  return (
    <div
      className={`flex aspect-square items-start rounded-md border border-primary/40 p-1 text-small ${todayRing} ${
        isFuture ? 'border-dashed text-primary-strong' : 'text-primary-strong'
      }`}
    >
      <span>
        {day}
        <span className="sr-only">{`, ${label}, no postcard`}</span>
      </span>
    </div>
  )
}
