export default function Spinner({ label = 'Loading' }) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}
