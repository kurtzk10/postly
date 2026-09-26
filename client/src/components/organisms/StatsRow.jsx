import StatTile from '../molecules/StatTile.jsx'

// Phone: the current streak is a full-width hero tile with the other two
// below it. From 640px: three tiles in a row.
export default function StatsRow({ currentStreak, longestStreak, totalPostcards }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div className="col-span-2 sm:col-span-1">
        <StatTile label="current streak" value={currentStreak} hero />
      </div>
      <StatTile label="longest streak" value={longestStreak} />
      <StatTile label="total postcards" value={totalPostcards} />
    </div>
  )
}
