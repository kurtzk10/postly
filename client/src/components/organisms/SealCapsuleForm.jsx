import { useState } from "react";
import { api } from '../../api/client.js';
import Button from '../atoms/Button.jsx';
import Label from '../atoms/Label.jsx';
import FormField from '../molecules/FormField.jsx';
import { addDays, toDateKey, formatPostcardDate } from '../../lib/dates.js';

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


export default function SealCapsuleForm({ postcards, onSealed }) {
    const [postcardId, setPostcardId] = useState('');
    const [message, setMessage] = useState('');
    const [unlockAt, setUnlockAt] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const tomorrow = toDateKey(addDays(new Date(), 1));

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const created = await api('/capsules', {
                method: 'POST',
                body: { postcardId: Number(postcardId), message, unlockAt },
            });
            onSealed(created);
            setPostcardId('');
            setMessage('');
            setUnlockAt('');
        } catch (err) {
            setError(err.message);
        }
        setSaving(false);
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-surface p-4">
            <h2 className="font-semibold">Seal a new capsule</h2>
            <Label htmlFor="capsule-postcard">Postcard</Label>
            <select id="capsule-postcard" value={postcardId}
                onChange={(e) => setPostcardId(e.target.value)} required
                className="block w-full rounded-lg border border-primary bg-bg px-3 py-2">
                <option value="">Choose a postcard…</option>
                {postcards.map((p) => (
                    <option key={p.id} value={p.id}>
                        {formatPostcardDate(p.date)} · {p.caption || 'No caption'}
                    </option>
                ))}
            </select>
            <FormField
                id="capsule-message"
                label="Message to future you"
                value={message}
                onChange={setMessage}
                placeholder="Write something to open later…"
                maxLength={500}
            />

            <Label htmlFor="capsule-unlock">Unlock on</Label>
            <input id="capsule-unlock" type="date" min={tomorrow} value={unlockAt}
                onChange={(e) => setUnlockAt(e.target.value)} required
                className="block w-full rounded-lg border border-primary bg-bg px-3 py-2" />
            {error && <p role="alert" className="text-small font-semibold text-red-800">{error}</p>}
            <Button type="submit" variant="accent" disabled={saving}>
                {saving ? 'Sealing…' : 'Seal capsule'}
            </Button>
        </form>
    );
}