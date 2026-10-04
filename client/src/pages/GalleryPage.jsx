import { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router'
import { usePostcards } from '../context/postcards.js'
import Button from '../components/atoms/Button.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import GalleryGrid from '../components/organisms/GalleryGrid.jsx'
import { api } from '../api/client.js';
import GalleryToolbar from '../components/molecules/GalleryToolbar.jsx'

export default function GalleryPage() {
  const { postcards, status, error, reload } = usePostcards()
  const [filters, setFilters] = useState({ q: '', sort: 'newest', month: '' });
  const [results, setResults] = useState({ status: 'loading', list: [], error: null });
  const months = [...new Set(postcards.map((p) => p.date.slice(0, 7)))].sort().reverse();

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.month) params.set('month', filters.month);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    const timer = setTimeout(() => {
      api(`/postcards?${params}`)
        .then((list) => !cancelled && setResults({ status: 'ready', list, error: null }))
        .catch((err) => !cancelled && setResults({ status: 'error', list: [], error: err.message }));
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filters, postcards]);

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between gap-4 rounded-xl bg-surface px-4 py-3">
        <h1 className="text-heading">Gallery</h1>
        {status === 'ready' && (
          <GalleryToolbar count={results.list.length} filters={filters}
            months={months} onChange={setFilters} />
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

      {status === 'ready' && postcards.length > 0 && <GalleryGrid postcards={results.list} />}

      {results.status === 'ready' && results.list.length === 0 && postcards.length > 0 && (
        <div className="space-y-4 rounded-xl border-2 border-dashed border-primary p-8 text-center">
          <p className="font-semibold">No postcards match.</p>
          <Button variant="ghost" onClick={() => setFilters({ q: '', sort: 'newest', month: '' })}>Clear filters</Button>
        </div>
      )}

      {results.status === 'error' && (
        <p role="alert" className="rounded-xl bg-surface p-4 font-semibold text-red-800">{results.error}</p>
      )}

      {/* /gallery/:id renders the detail modal here, over the grid. */}
      <Outlet />
    </div >
  )
}
