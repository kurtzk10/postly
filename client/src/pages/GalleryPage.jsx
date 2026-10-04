import { Link, Outlet } from 'react-router'
import { usePostcards } from '../context/postcards.js'
import Button from '../components/atoms/Button.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import GalleryGrid from '../components/organisms/GalleryGrid.jsx'

// =============================================================================
// GALLERY SEARCH, the page side (mine to write). Hints by the AI.
// Do this AFTER the API (postcards.js) and GalleryToolbar.jsx work.
// =============================================================================
//
// Today this page shows the whole list from the shared context. With filters,
// it asks YOUR API for just the matching postcards instead.
//
// 1. Imports to add: useEffect and useState from 'react', api from
//    '../api/client.js', and GalleryToolbar from '../components/molecules/…'.
//
// 2. Inside the component, under the usePostcards() line:
//
//    2a. The filter choices, starting with "no filters":
//          const [filters, setFilters] = useState({ q: '', sort: '___', month: '' });
//
//    2b. The matching postcards from the API:
//          const [results, setResults] = useState({ status: 'loading', list: [], error: null });
//
//    2c. The months for the dropdown, worked out from ALL postcards (so a
//        month doesn't vanish from the list while you're filtering):
//          const months = [...new Set(postcards.map((p) => p.date.slice(0, ___)))].sort().reverse();
//        ('2026-09-24'.slice(0, 7) is '2026-09'. new Set removes repeats.)
//
//    2d. Ask the API whenever the filters change. Two things are new here:
//        - URLSearchParams builds the "?q=…&month=…" part, and handles
//          spaces and symbols in what's typed, so you never glue it by hand.
//        - A 300 ms delay (setTimeout), so typing "tulip" sends ONE request
//          after you stop, not five. The cleanup cancels the timer if you
//          type again first.
//          useEffect(() => {
//            let cancelled = false;
//            const params = new URLSearchParams();
//            if (filters.q) params.set('q', filters.q);
//            if (filters.month) params.set('month', filters.___);
//            if (filters.sort !== 'newest') params.set('sort', filters.sort);
//            const timer = setTimeout(() => {
//              api(`/postcards?${params}`)
//                .then((list) => !cancelled && setResults({ status: 'ready', list, error: null }))
//                .catch((err) => !cancelled && setResults({ status: 'error', list: [], error: err.message }));
//            }, 300);
//            return () => {
//              cancelled = true;
//              clearTimeout(___);
//            };
//          }, [filters, postcards]);
//        Why `postcards` in the list too: deleting a postcard in the detail
//        view changes the shared list, so the gallery asks again and the
//        deleted one disappears.
//
// 3. In the return:
//    - Replace the "{postcards.length} postcards" <p> in the header with:
//        <GalleryToolbar count={results.list.length} filters={filters}
//                        months={months} onChange={___} />
//      (Keep the <h1>Gallery</h1>. Move the toolbar under the header box.)
//    - The grid shows the RESULTS, not the whole list:
//        <GalleryGrid postcards={results.___} />
//    - A NEW empty state for "you have postcards, but none match":
//        when results.status is 'ready', results.list is empty and
//        postcards.length is NOT 0, show "No postcards match." and a
//        "Clear filters" Button that sets the filters back to the 2a defaults.
//      Keep the existing "No postcards yet" box for when you have none at all.
//
// 4. Check /gallery: type "tulip", pick a month, switch to oldest first, open
//    a card and delete it (it should vanish). Then say "review".
// =============================================================================

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
