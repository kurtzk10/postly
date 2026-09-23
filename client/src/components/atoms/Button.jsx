const VARIANTS = {
  // The one call-to-action per screen. Charcoal on gold passes 4.5:1; white wouldn't.
  accent: 'bg-accent text-text hover:brightness-95',
  primary: 'bg-primary-strong text-white hover:brightness-110',
  ghost: 'border border-primary bg-bg text-primary-strong hover:bg-surface',
}

export default function Button({ variant = 'primary', type = 'button', className = '', children, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
