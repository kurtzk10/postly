// Decorative postage stamp for the back of a postcard.
export default function Stamp({ className = '' }) {
  return (
    <svg viewBox="0 0 48 56" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="46" height="54" fill="var(--color-bg)" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="3 2" />
      <rect x="7" y="7" width="34" height="42" fill="var(--color-accent)" />
      <circle cx="24" cy="22" r="7" fill="var(--color-bg)" />
      <path d="M11 45 L20 32 L26 39 L31 33 L37 45 Z" fill="var(--color-primary-strong)" />
    </svg>
  )
}
