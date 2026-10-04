import Button from '../atoms/Button.jsx';
import { thumbnailUrl } from '../../lib/images.js';
import { daysBetween, formatPostcardDate } from '../../lib/dates.js';

// =============================================================================
// CapsuleRow.jsx: one capsule in the vault list. (Wireframe page 5, box 3.)
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// PROPS it receives from CapsuleVault:
//   capsule   one object from GET /api/capsules (see server/src/routes/capsules.js
//             header for its fields: imageUrl, unlockAt, isLocked, openedAt…)
//   todayKey  today as 'YYYY-MM-DD'
//   onOpen    a function to call with the capsule when "Open now" is clicked
//
// TWO LOOKS:
//   locked  -> BLURRED thumbnail, a lock, "opens in 42 days"
//   ready   -> clear thumbnail, "ready to open", and an "Open now" button
//              (say "Read again" instead if capsule.openedAt is already set)
//

export default function CapsuleRow({ capsule, todayKey, onOpen }) {
    const daysLeft = daysBetween(todayKey, capsule.unlockAt);
    const countdown = daysLeft === 1 ? 'opens tomorrow' : `opens in ${daysLeft} days`;

    return (
        <li className="flex items-center gap-4 rounded-xl bg-bg p-3 flex-wrap">
            <img
                src={thumbnailUrl(capsule.imageUrl)}
                alt=""
                className={`size-16 shrink-0 rounded-md object-cover ${capsule.isLocked ? 'blur-sm' : ''}`}
            />
            <div className="flex-1">
                <p>Sealed with your postcard from {formatPostcardDate(capsule.postcardDate)}</p>
                <p className="text-small text-primary-strong">{capsule.isLocked ? <><span aria-hidden="true">🔒</span> {countdown}</> : 'ready to open'}</p>
            </div>
            {!capsule.isLocked && (
                <Button variant="accent" onClick={() => onOpen(capsule)}>
                    {capsule.openedAt ? 'Read again' : 'Open now'}
                </Button>
            )}
        </li>
    )
}