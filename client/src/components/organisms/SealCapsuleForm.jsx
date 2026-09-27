// =============================================================================
// SealCapsuleForm.jsx: "Seal a new capsule". (Wireframe page 5, box 2.)
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// Three fields: pick a postcard, message to future you, unlock date.
// Then POST /api/capsules and hand the new capsule back to CapsulePage.
//
// PROPS from CapsulePage:
//   postcards  the postcards list (for the dropdown)
//   onSealed   call it with the new capsule the server sends back
//
// Your server already validates everything, so this form's job is to send the
// request and SHOW the server's error message if there is one.
// Write each line UNDER its hint.

// STEP 1: imports
//   - useState from 'react'
//   - api from '../../api/client.js'           (it throws with the server's message)
//   - Button, Label from '../atoms/…'
//   - FormField from '../molecules/FormField.jsx'   (the caption box from /capture)
//   - addDays, toDateKey, formatPostcardDate from '../../lib/dates.js'

// STEP 2: export default function SealCapsuleForm({ ___, ___ }) {

//   2a. One state per field, all starting empty (''), plus two for the request:
//         const [postcardId, setPostcardId] = useState('');
//         const [message, setMessage] = useState(___);
//         const [unlockAt, setUnlockAt] = useState(___);
//         const [saving, setSaving] = useState(false);
//         const [error, setError] = useState(null);

//   2b. The earliest allowed unlock date is TOMORROW. It goes on the date
//       input's `min`, so the browser's picker greys out today and earlier:
//         const tomorrow = toDateKey(addDays(new Date(), ___));

//   2c. The submit handler:
//         async function handleSubmit(e) {
//           e.preventDefault();          // stops the browser reloading the page
//           setSaving(true);
//           setError(null);
//           try {
//             const created = await api('/capsules', {
//               method: '___',
//               body: { postcardId: Number(postcardId), message, unlockAt },
//             });
//             onSealed(created);
//             ...then clear the three fields back to ''
//           } catch (err) {
//             setError(err.message);     // e.g. "unlockAt must be a future date"
//           }
//           setSaving(false);
//         }
//       Why Number(postcardId)? A <select> always gives text ("7"), and your
//       server requires a real whole number.

//   2d. return (
//         <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-surface p-4">
//           <h2 className="font-semibold">Seal a new capsule</h2>
//
//           THE POSTCARD DROPDOWN. A <Label htmlFor="capsule-postcard"> and a
//           <select id="capsule-postcard"> with the same id, so clicking the
//           label focuses it (the accessibility rule in CLAUDE.md):
//             <select id="capsule-postcard" value={postcardId}
//                     onChange={(e) => setPostcardId(e.target.value)} required
//                     className="block w-full rounded-lg border border-primary bg-bg px-3 py-2">
//               <option value="">Choose a postcard…</option>
//               {postcards.map((p) => (
//                 <option key={p.id} value={___}>
//                   {formatPostcardDate(p.date)} · {p.caption || 'No caption'}
//                 </option>
//               ))}
//             </select>
//
//           THE MESSAGE. Reuse FormField: look at how CaptureForm.jsx uses it.
//           Give it id="capsule-message", label "Message to future you",
//           value/onChange for message, and maxLength={500} (your column's limit).
//
//           THE DATE. Label + <input type="date"> (always sends YYYY-MM-DD):
//             <input id="capsule-unlock" type="date" min={___} value={unlockAt}
//                    onChange={(e) => setUnlockAt(e.target.value)} required
//                    className="block w-full rounded-lg border border-primary bg-bg px-3 py-2" />
//
//           THE ERROR, only when there is one. role="alert" makes screen
//           readers announce it:
//             {error && <p role="alert" className="text-small font-semibold text-red-800">{error}</p>}
//
//           THE BUTTON. type="submit" so pressing it (or Enter) runs handleSubmit.
//           Disabled while saving, so a double click can't seal two capsules:
//             <Button type="submit" variant="accent" disabled={___}>
//               {saving ? 'Sealing…' : 'Seal capsule'}
//             </Button>
//         </form>
//       );

// STEP 3: close the component with }
