import { useState } from "react";
import Button from "../atoms/Button";
import Label from "../atoms/Label";
import { formatMonth, fromDateKey } from "../../lib/dates";

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

export default function GalleryToolbar({ count, filters, months, onChange }) {
    const [open, setOpen] = useState(false);

    function update(field, value) {
        onChange({ ...filters, [field]: value });
    }

    return (
        <div className="space-y-3 rounded-xl bg-surface px-4 py-3">
            <div className="flex items-center justify-between gap-4">
                <p className="text-small text-primary-strong">
                    {count} {count === 1 ? 'postcard' : 'postcards'}
                </p>
                <Button variant="ghost" className="sm:hidden" onClick={() => setOpen(!open)}
                    aria-expanded={open} aria-controls="gallery-filters">Filters</Button>
            </div>

            <div id="gallery-filters"
                className={`${open ? 'grid' : 'hidden'} gap-3 sm:grid sm:grid-cols-3`}>
                <div className="space-y-1">
                    <Label htmlFor="gallery-search">Search captions</Label>
                    <input id="gallery-search" type="search" value={filters.q}
                        onChange={(e) => update('q', e.target.value)}
                        placeholder="e.g. tulip"
                        className="block w-full rounded-lg border border-primary bg-bg px-3 py-2" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="gallery-sort">Sort</Label>
                    <select id="gallery-sort" value={filters.sort}
                        onChange={(e) => update('sort', e.target.value)}
                        className="block w-full rounded-lg border border-primary bg-bg px-3 py-2">
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="gallery-month">Month</Label>
                    <select id="gallery-month" value={filters.month}
                        onChange={(e) => update('month', e.target.value)}
                        className="block w-full rounded-lg border border-primary bg-bg px-3 py-2">
                        <option value="">All months</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{formatMonth(fromDateKey(`${m}-01`))}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div >
    )
}