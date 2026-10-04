import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { api } from '../../api/client.js'
import { usePostcards } from '../../context/postcards.js'
import { formatPostcardDate } from '../../lib/dates.js'
import Button from '../atoms/Button.jsx'
import Spinner from '../atoms/Spinner.jsx'
import PostcardFront from '../molecules/PostcardFront.jsx'
import PostcardBack from '../molecules/PostcardBack.jsx'
import PostcardSheet from '../molecules/PostcardSheet.jsx'
import { downloadAsPng } from '../../lib/downloadImage.js'

// Rendered by the /gallery/:id and /streaks/:id routes, over that page. A native
// <dialog> gives us the focus trap, Esc key and backdrop for free.
export default function PostcardDetailModal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { postcards, removePostcard } = usePostcards()
  const dialogRef = useRef(null)
  const sheetRef = useRef(null)

  const [fetched, setFetched] = useState({ id: null, postcard: null, error: null })
  const [face, setFace] = useState('front')
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  // Always ask the API, so a pasted /gallery/abc or a deleted id gets the
  // server's 400/404 message. The gallery list fills in while it loads.
  useEffect(() => {
    let cancelled = false
    api(`/postcards/${encodeURIComponent(id)}`)
      .then((postcard) => !cancelled && setFetched({ id, postcard, error: null }))
      .catch((err) => !cancelled && setFetched({ id, postcard: null, error: err.message }))
    return () => {
      cancelled = true
    }
  }, [id])

  const current = fetched.id === id ? fetched : null
  const postcard = current?.postcard ?? (current?.error ? null : postcards.find((p) => String(p.id) === id))
  const error = current?.error

  function close() {
    // Closing before navigating hands focus back to the card that opened it.
    dialogRef.current?.close()
    // '..' is the page that opened the modal: /gallery or /streaks.
    navigate('..')
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      await api(`/postcards/${postcard.id}`, { method: 'DELETE' })
    } catch (err) {
      // Already gone (e.g. deleted in another tab) is still a success here.
      if (err.status !== 404) {
        setDeleting(false)
        setDeleteError(err.message)
        return
      }
    }
    removePostcard(postcard.id)
    close()
  }

  const dateLabel = postcard ? formatPostcardDate(postcard.date) : ''

  // Saves the front and back together as one PNG, from the off-screen sheet below.
  async function handleDownload() {
    setDownloading(true)
    setDownloadError(null)
    try {
      await downloadAsPng(sheetRef.current, `postly-${postcard.date}.png`)
    } catch {
      setDownloadError("Couldn't create the image. Try again.")
    }
    setDownloading(false)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="detail-heading"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => e.target === dialogRef.current && close()}
      className="m-0 h-full max-h-none w-full max-w-none bg-bg text-text backdrop:bg-text/60 sm:m-auto sm:h-fit sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl"
    >
      <div className="flex items-center justify-between gap-4 border-b border-primary/40 bg-surface px-6 py-3">
        <h2 id="detail-heading" className="text-heading">
          {postcard ? dateLabel : error ? 'Postcard not available' : 'Loading…'}
        </h2>
        <button type="button" onClick={close} aria-label="Close" className="rounded-lg px-3 py-1 text-heading">
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="space-y-4 p-6">
        {!postcard && !error && (
          <div className="flex justify-center py-16">
            <Spinner label="Loading postcard" />
          </div>
        )}

        {error && (
          <div role="alert" className="space-y-4">
            <p>{error}</p>
            <Button variant="ghost" onClick={close}>
              Close
            </Button>
          </div>
        )}

        {postcard && (
          <>
            {face === 'front' ? (
              <PostcardFront
                imageUrl={postcard.imageUrl}
                templateSlug={postcard.templateSlug}
                alt={postcard.caption || `Postcard from ${dateLabel}`}
              />
            ) : (
              <PostcardBack caption={postcard.caption} dateLabel={dateLabel} />
            )}
            <p className="text-small text-primary-strong">
              {face === 'front' ? 'Front' : 'Back'} · {postcard.templateName} template
            </p>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="ghost" onClick={() => setFace(face === 'front' ? 'back' : 'front')}>
                Flip
              </Button>
              <Button variant="ghost" onClick={handleDownload} disabled={downloading}>
                {downloading ? 'Saving…' : 'Download'}
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(true)} disabled={confirming}>
                Delete
              </Button>
            </div>

            {downloadError && (
              <p role="alert" className="text-small font-semibold text-red-800">
                {downloadError}
              </p>
            )}

            {/* What Download captures: front and back together, kept off-screen. */}
            <div aria-hidden="true" className="pointer-events-none fixed top-0 left-[-10000px]">
              <PostcardSheet ref={sheetRef} postcard={postcard} dateLabel={dateLabel} />
            </div>

            {confirming && (
              <div role="alertdialog" aria-labelledby="confirm-text" className="space-y-3 rounded-xl border-2 border-dashed border-primary p-4 text-center">
                <p id="confirm-text" className="font-semibold">
                  Delete this postcard? This can't be undone.
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" onClick={() => setConfirming(false)} disabled={deleting} autoFocus>
                    Cancel
                  </Button>
                  <Button onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
                {deleteError && (
                  <p role="alert" className="text-small font-semibold text-red-800">
                    {deleteError}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </dialog>
  )
}
