import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../api/client";
import Button from "../atoms/Button";
import PostcardFront from "../molecules/PostcardFront";
import { formatPostcardDate } from "../../lib/dates";

// =============================================================================
// FlashbackStrip.jsx: one past postcard, from your GET /api/flashback.
// (Wireframe page 5, box 4: "Flashback - on this day last year" + shuffle.)
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// This one fetches its OWN data, so it takes no props. Your API answers:
//   200 { reason: 'on-this-day' | 'random', postcard: {...} }
//   404 { error: 'No postcards to look back on yet' }
//

export default function FlashbackStrip() {
    const [stats, setStats] = useState({ status: 'loading', data: null, error: null })
    const [shuffles, setShuffles] = useState(0);

    useEffect(() => {
        let cancelled = false
        api('/flashback')
            .then((data) => {
                if (cancelled) return
                setStats({ status: 'ready', data, error: null })
            })
            .catch((err) => {
                if (cancelled) return
                if (err.status === 404) {
                    setStats({ status: 'none', data: null, error: null })
                } else {
                    setStats({ status: 'error', data: null, error: err.message })
                }
            })
        return () => { cancelled = true }
    }, [shuffles])

    const heading = stats.data?.reason === 'on-this-day' ? 'On this day last year' : 'A flashback';

    return (
        <section aria-labelledby="flashback-heading" className="space-y-3 rounded-xl bg-surface p-4">
            <h2 id="flashback-heading" className="font-semibold">{heading}</h2>

            {stats.status === 'ready' && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="w-full sm:w-48">
                        <PostcardFront imageUrl={stats.data.postcard.imageUrl} templateSlug={stats.data.postcard.templateSlug} alt={stats.data.postcard.caption || 'A past postcard'} compact />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p>{stats.data.postcard.caption || 'No caption'}</p>
                        <p className="text-small text-primary-strong">{formatPostcardDate(stats.data.postcard.date)}</p>
                        <Link to={`/gallery/${stats.data.postcard.id}`} className="font-semibold text-primary-strong underline">Open it</Link>
                    </div>
                </div>
            )}

            {stats.status === 'none' && <p>No older postcards yet.</p>}
            {stats.status === 'error' && <p role="alert">{stats.error}</p>}

            <Button variant="ghost" onClick={() => setShuffles((n) => n + 1)}>Shuffle</Button>
        </section>
    )
}
