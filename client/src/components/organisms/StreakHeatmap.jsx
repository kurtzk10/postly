import { useEffect, useMemo, useRef } from 'react'
import HeatmapCell from '../atoms/HeatmapCell.jsx'
import { addDays, formatPostcardDate, startOfWeek, toDateKey } from '../../lib/dates.js'

const WEEKS = 53
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', '']

// The last 53 weeks, one column per week and one row per weekday (Mon at the
// top). On a phone it scrolls sideways inside its own box, never the page.
export default function StreakHeatmap({ postcardsByDate, today, linkFor }) {
  const scrollRef = useRef(null)
  const todayKey = toDateKey(today)

  const weeks = useMemo(() => {
    const firstMonday = addDays(startOfWeek(today), -(WEEKS - 1) * 7)
    return Array.from({ length: WEEKS }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => addDays(firstMonday, w * 7 + d)),
    )
  }, [today])

  // Start scrolled to the most recent weeks, which matter most.
  useEffect(() => {
    const box = scrollRef.current
    box.scrollLeft = box.scrollWidth
  }, [])

  const filledCount = weeks.flat().filter((date) => postcardsByDate.has(toDateKey(date))).length

  return (
    <section aria-labelledby="heatmap-heading" className="space-y-3 rounded-xl bg-surface p-4">
      <h2 id="heatmap-heading" className="font-semibold">
        The past year <span className="lg:hidden" aria-hidden="true">→</span>
      </h2>

      <div className="flex gap-2">
        <div aria-hidden="true" className="mt-6 grid shrink-0 grid-rows-7 gap-1 text-small leading-none text-primary-strong">
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="flex h-3.5 items-center">
              {label}
            </span>
          ))}
        </div>

        <div ref={scrollRef} className="min-w-0 overflow-x-auto px-1 pb-2">
          <div
            role="group"
            aria-label={`${filledCount} postcards in the past year. Filled days link to their postcard.`}
            className="flex w-max gap-1"
          >
            {weeks.map((week, w) => {
              const monthStarts = week.find((date) => date.getDate() === 1)
              return (
                <div key={toDateKey(week[0])} className="flex flex-col gap-1">
                  {/* Month name above the week in which a month begins */}
                  <span aria-hidden="true" className="h-5 w-3.5 whitespace-nowrap text-small leading-5 text-primary-strong">
                    {monthStarts || w === 0 ? (monthStarts ?? week[0]).toLocaleDateString(undefined, { month: 'short' }) : ''}
                  </span>
                  {week.map((date) => {
                    const key = toDateKey(date)
                    const postcard = postcardsByDate.get(key)
                    return (
                      <HeatmapCell
                        key={key}
                        label={formatPostcardDate(key)}
                        to={postcard ? linkFor(postcard) : undefined}
                        isToday={key === todayKey}
                        isFuture={date > today}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <p aria-hidden="true" className="flex items-center gap-4 text-small text-primary-strong">
        <span className="flex items-center gap-1">
          <span className="block size-3.5 rounded-sm border border-primary/50 bg-bg" /> no postcard
        </span>
        <span className="flex items-center gap-1">
          <span className="block size-3.5 rounded-sm bg-primary-strong" /> postcard
        </span>
        <span className="flex items-center gap-1">
          <span className="block size-3.5 rounded-sm ring-2 ring-accent" /> today
        </span>
      </p>
    </section>
  )
}
