import { Link, Outlet } from 'react-router'
import { usePostcards } from '../context/postcards.js'
import Button from '../components/atoms/Button.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import GalleryGrid from '../components/organisms/GalleryGrid.jsx'

export default function GalleryPage() {
  const { postcards, status, error, reload } = usePostcards()

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between gap-4 rounded-xl bg-surface px-4 py-3">
        <h1 className="text-heading">Gallery</h1>
        {status === 'ready' && (
          <p className="text-small text-primary-strong">
            {postcards.length} {postcards.length === 1 ? 'postcard' : 'postcards'}
          </p>
        )}
      </div>

      {status === 'loading' && (
        <div className="flex justify-center py-16">
          <Spinner label="Loading postcards" />
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="space-y-4 rounded-xl bg-surface p-6">
          <p>{error}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      )}

      {status === 'ready' && postcards.length === 0 && (
        <div className="space-y-4 rounded-xl border-2 border-dashed border-primary p-8 text-center">
          <p className="font-semibold">No postcards yet. Make your first one.</p>
          <Link
            to="/capture"
            className="inline-block rounded-full bg-accent px-5 py-2 font-semibold text-text hover:brightness-95"
          >
            Go to today →
          </Link>
        </div>
      )}

      {status === 'ready' && postcards.length > 0 && <GalleryGrid postcards={postcards} />}

      {/* /gallery/:id renders the detail modal here, over the grid. */}
      <Outlet />
    </div>
  )
}
