import Badge from '../atoms/Badge.jsx'
import { formatLongDate } from '../../lib/dates.js'

export default function TodayStatusBar({ done }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface px-4 py-3">
      <h1 className="text-heading">{formatLongDate()}</h1>
      <Badge tone={done ? 'done' : 'neutral'}>
        {done ? "Today's postcard: done" : "Today's postcard: not made yet"}
      </Badge>
    </div>
  )
}
