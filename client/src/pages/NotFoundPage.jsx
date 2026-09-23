import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="space-y-4 rounded-xl bg-surface p-6">
      <h1 className="text-heading">Page not found</h1>
      <p>
        There's nothing at this address.{' '}
        <Link to="/capture" className="font-semibold text-primary-strong underline">
          Go to today's postcard
        </Link>
        .
      </p>
    </section>
  )
}
