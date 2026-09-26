import CalendarDay from '../molecules/CalendarDay.jsx'
import { addDays, formatMonth, formatPostcardDate, startOfWeek, toDateKey } from '../../lib/dates.js'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// This month as a Monday-first grid, with a thumbnail on each filled day.
export default function MonthCalendar({ postcardsByDate, today, linkFor }) {
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7 // Monday-first
  const todayKey = toDateKey(today)
  const gridStart = startOfWeek(firstOfMonth)

  return (
    <section aria-labelledby="calendar-heading" className="space-y-3 rounded-xl bg-surface p-4">
      <h2 id="calendar-heading" className="font-semibold">
        This month · {formatMonth(today)}
      </h2>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAYS.map((name) => (
          <span key={name} aria-hidden="true" className="text-center text-small text-primary-strong">
            {name}
          </span>
        ))}

        {Array.from({ length: leadingBlanks }, (_, i) => (
          <span key={`blank-${toDateKey(addDays(gridStart, i))}`} aria-hidden="true" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = addDays(firstOfMonth, i)
          const key = toDateKey(date)
          const postcard = postcardsByDate.get(key)
          return (
            <CalendarDay
              key={key}
              day={i + 1}
              label={formatPostcardDate(key)}
              postcard={postcard}
              to={postcard ? linkFor(postcard) : undefined}
              isToday={key === todayKey}
              isFuture={key > todayKey}
            />
          )
        })}
      </div>
    </section>
  )
}
