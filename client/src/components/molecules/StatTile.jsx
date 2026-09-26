export default function StatTile({ label, value, hero = false }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-surface p-4 text-center">
      <span className={`font-type font-bold ${hero ? 'text-5xl sm:text-4xl' : 'text-4xl'}`}>{value}</span>
      <span className="text-small text-primary-strong">{label}</span>
    </div>
  )
}
