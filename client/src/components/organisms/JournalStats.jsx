import { formatPostcardDate } from '../../lib/dates.js'

export default function JournalStats({ stats, firstPostcardDate }) {
  const rows = [
    ['Best month', `${stats.bestMonth.label} · ${stats.bestMonth.count} ${stats.bestMonth.count === 1 ? 'postcard' : 'postcards'}`],
    ['Average per week', `${stats.averagePerWeek.toFixed(1)} postcards`],
    ['Days missed', stats.daysMissed === 0 ? 'None. Every day so far!' : `${stats.daysMissed} since your first postcard`],
    ['First postcard', firstPostcardDate ? formatPostcardDate(firstPostcardDate) : '-'],
  ]

  return (
    <section aria-labelledby="journal-stats-heading" className="space-y-3 rounded-xl bg-surface p-4">
      <h2 id="journal-stats-heading" className="font-semibold">
        Journaling stats
      </h2>
      <dl className="divide-y divide-primary/30">
        {rows.map(([term, value]) => (
          <div key={term} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2">
            <dt className="text-primary-strong">{term}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
