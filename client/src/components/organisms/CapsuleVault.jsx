import CapsuleRow from "../molecules/CapsuleRow";

// =============================================================================
// CapsuleVault.jsx: the list of capsules. (Wireframe page 5, box 3, "The vault".)
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// PROPS from CapsulePage:
//   capsules  the array from GET /api/capsules
//   todayKey  today as 'YYYY-MM-DD'
//   onOpen    passed straight through to each CapsuleRow
//

export default function CapsuleVault({ capsules, todayKey, onOpen }) {
    return (
        <section aria-labelledby="vault-heading" className="space-y-3 rounded-xl bg-surface p-4">
            <h2 id="vault-heading" className="font-semibold">
                The vault
            </h2>
            {capsules.length === 0 ? (<p>No capsules yet.</p>) :
                <ul className="space-y-2">
                    {capsules.map((capsule) => (
                        <CapsuleRow key={capsule.id} capsule={capsule} todayKey={todayKey} onOpen={onOpen} />
                    ))}
                </ul>
            }
        </section>
    )
}