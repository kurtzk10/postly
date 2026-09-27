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
// Model: PostcardDetailModal.jsx. It uses the same native <dialog>, which
// gives you Esc-to-close, a dark backdrop and keyboard focus for free.
// Write each line UNDER its hint.

// STEP 1: imports: useEffect and useRef from 'react', Button, thumbnailUrl,
//         and formatPostcardDate.

// STEP 2: export default function CapsuleRevealModal({ ___, ___ }) {

//   2a. A ref, so you can reach the real <dialog> element:
//         const dialogRef = useRef(null);

//   2b. Open it as a modal once it's on the page. Copy the effect from the
//       top of PostcardDetailModal.jsx (the one with showModal). The
//       `if (!dialog.open)` check matters: React runs effects twice in
//       development.

//   2c. A close function that closes the dialog, THEN tells the page:
//         function close() {
//           dialogRef.current?.close();
//           ___();
//         }

//   2d. return (
//         <dialog ref={dialogRef}
//                 aria-labelledby="reveal-heading"
//                 onCancel={(e) => { e.preventDefault(); close(); }}
//                 className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-xl bg-bg p-6 text-text backdrop:bg-text/60">
//           (onCancel fires on Esc. preventDefault stops the browser closing it
//            on its own, so YOUR close() runs and the page state updates too.)
//
//           A heading with id="reveal-heading", e.g. "A message from past you".
//           The postcard photo: <img src={thumbnailUrl(capsule.imageUrl, 480)} alt="" …/>
//           The date it was sealed with: formatPostcardDate(capsule.___)
//           THE MESSAGE, in the typewriter font like the back of a postcard:
//             <p className="font-type whitespace-pre-line">{capsule.___}</p>
//             (whitespace-pre-line keeps any line breaks you typed)
//           A close button: <Button onClick={close}>Close</Button>
//         </dialog>
//       );

// STEP 3: close the component with }
