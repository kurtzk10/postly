const TONES = {
  neutral: 'border-primary text-primary-strong',
  done: 'border-accent bg-accent/20 text-text',
}

export default function Badge({ tone = 'neutral', children }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-0.5 text-small font-semibold ${TONES[tone]}`}>
      {children}
    </span>
  )
}
