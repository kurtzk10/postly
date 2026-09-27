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
// These hints are shorter on purpose. The fetch pattern is the same one you
// can see in StreaksPage.jsx (the useEffect with `cancelled`).

// STEP 1: imports: useEffect, useState; Link from 'react-router'; api; Button;
//         PostcardFront (molecules); formatPostcardDate.

// STEP 2: the component (default export, no props).

//   2a. State: { status: 'loading' | 'ready' | 'none' | 'error', data, error }.
//       Plus a counter, `shuffles`, that goes up by 1 each time Shuffle is
//       pressed. Putting it in the effect's dependency list [shuffles] is
//       what makes the effect fetch again.

//   2b. The effect: call api('/flashback').
//       - success         -> status 'ready', keep the data
//       - err.status 404  -> status 'none' (NOT an error: just no older postcards)
//       - anything else   -> status 'error', keep err.message
//       Use the `cancelled` flag so an old response can't overwrite a newer one.

//   2c. The heading depends on data.reason:
//         'on-this-day' -> "On this day last year"
//         'random'      -> "A flashback"

//   2d. Render a <section aria-labelledby="flashback-heading"> card with:
//       - the heading
//       - status 'ready': the postcard front (PostcardFront with imageUrl,
//         templateSlug and compact), its date, its caption, and a Link to
//         `/gallery/${…id}` so it can be opened in full
//       - status 'none': a short "No older postcards yet" sentence
//       - status 'error': the message
//       - a Shuffle button (variant "ghost") that bumps the counter. Hide it
//         for 'on-this-day'? Your call: say why in your video.
//       On desktop the wireframe puts the photo LEFT of the text
//       (a flex row); on a phone they stack.

// STEP 3: close the component.
