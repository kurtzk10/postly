import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet } from 'react-router'
import { api } from '../api/client.js'
import { usePostcards } from '../context/postcards.js'
import { toDateKey } from '../lib/dates.js'
import { journalStats } from '../lib/journalStats.js'
import Button from '../components/atoms/Button.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import StatsRow from '../components/organisms/StatsRow.jsx'
import StreakHeatmap from '../components/organisms/StreakHeatmap.jsx'
import MonthCalendar from '../components/organisms/MonthCalendar.jsx'
import JournalStats from '../components/organisms/JournalStats.jsx'

const linkFor = (postcard) => `/streaks/${postcard.id}`

export default function StreaksPage() {
  const { postcards, status: listStatus, error: listError, reload } = usePostcards()
  const [today] = useState(() => new Date())
  const [stats, setStats] = useState({ status: 'loading', data: null, error: null })
  const [statsAttempt, setStatsAttempt] = useState(0)

  // GET /api/stats (the streak numbers). Asked again whenever the postcards
  // list changes, so saving or deleting one updates the streak straight away.
  useEffect(() => {
    let cancelled = false
    api('/stats')
      .then((data) => !cancelled && setStats({ status: 'ready', data, error: null }))
      .catch((err) => !cancelled && setStats({ status: 'error', data: null, error: err.message }))
    return () => {
      cancelled = true
    }
  }, [postcards, statsAttempt])

  const postcardsByDate = useMemo(() => new Map(postcards.map((p) => [p.date, p])), [postcards])
  const extraStats = useMemo(() => journalStats(postcards, toDateKey(today)), [postcards, today])

  const loading = listStatus === 'loading' || (stats.status === 'loading' && !stats.data)
  const failed = listStatus === 'error' || stats.status === 'error'

  return (
    <div className="space-y-8">
      <h1 className="text-heading">Streaks</h1>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner label="Loading your streaks" />
        </div>
      )}

      {!loading && failed && (
        <div role="alert" className="space-y-4 rounded-xl bg-surface p-6">
          <p>{listError || stats.error}</p>
          <Button
            onClick={() => {
              if (listStatus === 'error') reload()
              setStatsAttempt((n) => n + 1)
            }}
          >
            Try again
          </Button>
        </div>
      )}

      {!loading && !failed && postcards.length === 0 && (
        <div className="space-y-4 rounded-xl border-2 border-dashed border-primary p-8 text-center">
          <p className="font-semibold">No postcards yet, so no streak yet. Today is a good day to start one.</p>
          <Link
            to="/capture"
            className="inline-block rounded-full bg-accent px-5 py-2 font-semibold text-text hover:brightness-95"
          >
            Make today's postcard →
          </Link>
        </div>
      )}

      {!loading && !failed && postcards.length > 0 && stats.data && (
        <>
          <StatsRow
            currentStreak={stats.data.currentStreak}
            longestStreak={stats.data.longestStreak}
            totalPostcards={stats.data.totalPostcards}
          />
          <StreakHeatmap postcardsByDate={postcardsByDate} today={today} linkFor={linkFor} />
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <MonthCalendar postcardsByDate={postcardsByDate} today={today} linkFor={linkFor} />
            <JournalStats stats={extraStats} firstPostcardDate={stats.data.firstPostcardDate} />
          </div>
        </>
      )}

      {/* /streaks/:id opens the postcard detail modal over this page. */}
      <Outlet />
    </div>
  )
}
