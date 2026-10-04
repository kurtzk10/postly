export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`block w-full rounded-lg border border-primary bg-bg px-3 py-2 placeholder:text-primary-strong ${className}`}
      {...props}
    />
  )
}
