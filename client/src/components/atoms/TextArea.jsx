export default function TextArea({ className = '', ...props }) {
  return (
    <textarea
      className={`block w-full resize-y rounded-lg border border-primary bg-bg px-3 py-2 placeholder:text-primary-strong ${className}`}
      {...props}
    />
  )
}
