// =============================================================================
// GalleryToolbar.jsx: the bar above the gallery grid. (Wireframe page 3, box 1:
// "42 postcards · search captions… · sort: newest · month ▾")
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// PROPS from GalleryPage:
//   count     how many postcards are showing
//   filters   { q, sort, month }: the current choices
//   months    ['2026-09', '2026-08', …]: months that have postcards, newest first
//   onChange  call it with the NEW filters object whenever something changes
//
// The toolbar doesn't keep the filters itself. GalleryPage owns them (it
// needs them to ask the API); this just shows them and reports changes.
// Phone (below 640px): only the count and a "Filters" button; tapping it
// shows the three controls. From 640px: everything in one row.
// Write each line UNDER its hint. Fill in the ___ parts.

// STEP 1: imports
//   - useState from 'react'                      (for the phone open/closed)
//   - Button and Label (atoms)
//   - formatMonth and fromDateKey from '../../lib/dates.js'

// STEP 2: export default function GalleryToolbar({ ___, ___, ___, ___ }) {

//   2a. Phone only: are the controls showing?
//         const [open, setOpen] = useState(___);

//   2b. One helper so each control only says what changed. It copies the
//       current filters and replaces one field:
//         function update(field, value) {
//           onChange({ ...filters, [field]: value });
//         }
//       ([field] in brackets means "the field whose NAME is in `field`",
//        so update('q', 'tulip') sets filters.q.)

//   2c. return (
//         <div className="space-y-3 rounded-xl bg-surface px-4 py-3">
//
//           THE TOP ROW: the count on the left, the phone button on the right.
//             <div className="flex items-center justify-between gap-4">
//               <p className="text-small text-primary-strong">
//                 {count} {count === 1 ? 'postcard' : 'postcards'}
//               </p>
//               <Button variant="ghost" className="sm:hidden" onClick={() => setOpen(!open)}
//                       aria-expanded={open} aria-controls="gallery-filters">
//                 Filters
//               </Button>
//             </div>
//
//           THE CONTROLS: hidden on phones unless open, always shown from 640px
//           (same trick as the "+ New capsule" form on /capsule):
//             <div id="gallery-filters"
//                  className={`${open ? 'grid' : 'hidden'} gap-3 sm:grid sm:grid-cols-3`}>
//
//             SEARCH. type="search" gives a clear (×) button on most browsers.
//             Each control gets a Label with a matching htmlFor/id:
//               <div className="space-y-1">
//                 <Label htmlFor="gallery-search">Search captions</Label>
//                 <input id="gallery-search" type="search" value={filters.___}
//                        onChange={(e) => update('q', e.target.value)}
//                        placeholder="e.g. tulip"
//                        className="block w-full rounded-lg border border-primary bg-bg px-3 py-2" />
//               </div>
//
//             SORT. A <select> with two <option>s. Their `value`s must be the
//             exact words your API accepts:
//               <select id="gallery-sort" value={filters.sort}
//                       onChange={(e) => update('___', e.target.value)} …same classes…>
//                 <option value="newest">Newest first</option>
//                 <option value="___">Oldest first</option>
//               </select>
//
//             MONTH. "All months" has value "" (no filter), then one option per
//             month. Show "September 2026", but send "2026-09":
//               <select id="gallery-month" value={filters.month}
//                       onChange={(e) => update('month', e.target.value)} …same classes…>
//                 <option value="">All months</option>
//                 {months.map((m) => (
//                   <option key={m} value={m}>{formatMonth(fromDateKey(`${m}-01`))}</option>
//                 ))}
//               </select>
//             (fromDateKey wants a full date, so -01 makes "2026-09" into the 1st.)
//
//             </div>
//         </div>
//       );

// STEP 3: close the component with }
