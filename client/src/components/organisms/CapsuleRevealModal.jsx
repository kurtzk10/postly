import { useEffect, useRef } from "react";
import Button from "../atoms/Button";
import { thumbnailUrl } from "../../lib/images";
import { formatPostcardDate } from "../../lib/dates";

// =============================================================================
// CapsuleRevealModal.jsx: shows an opened capsule's message. (Wireframe page 5,
// "Capsule reveal - modal".)
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// PROPS from CapsulePage:
//   capsule  the opened capsule (it now HAS its message)
//   onClose  call it to close the modal
//

export default function CapsuleRevealModal({ capsule, onClose }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog.open) dialog.showModal()
    }, [])

    function close() {
        dialogRef.current?.close();
        onClose();
    }

    return (
        <dialog ref={dialogRef}
            aria-labelledby="reveal-heading"
            onCancel={(e) => { e.preventDefault(); close(); }}
            className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-xl bg-bg p-6 text-text backdrop:bg-text/60 space-y-4">
            <h2 className="text-heading" id="reveal-heading">A message from past you</h2>
            <img className="aspect-square w-full rounded-lg object-cover" src={thumbnailUrl(capsule.imageUrl, 480)} alt={`Your postcard from ${formatPostcardDate(capsule.postcardDate)}`} />
            <p className="font-type whitespace-pre-line">{capsule.message}</p>
            <p className="text-small text-primary-strong">Sealed with your postcard from {formatPostcardDate(capsule.postcardDate)}</p>
            <Button onClick={close}>Close</Button>
        </dialog>
    )
}