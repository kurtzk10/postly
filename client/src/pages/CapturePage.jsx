import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../api/client.js'
import { MAX_UPLOAD_BYTES, uploadImage } from '../api/cloudinary.js'
import { usePostcards } from '../context/postcards.js'
import { formatLongDate, formatPostcardDate } from '../lib/dates.js'
import Button from '../components/atoms/Button.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import TodayStatusBar from '../components/molecules/TodayStatusBar.jsx'
import CaptureForm, { CAPTION_MAX } from '../components/organisms/CaptureForm.jsx'
import PostcardPreview from '../components/organisms/PostcardPreview.jsx'

const EMPTY_INPUT = { imageUrl: '', localPreviewUrl: '', caption: '', templateId: null }

export default function CapturePage() {
  const navigate = useNavigate()
  const { addPostcard } = usePostcards()

  const [loadState, setLoadState] = useState({ status: 'loading', error: null })
  const [todayPostcard, setTodayPostcard] = useState(null)
  const [templates, setTemplates] = useState([])

  const [input, setInput] = useState(EMPTY_INPUT)
  const [uploadStatus, setUploadStatus] = useState('idle') // 'idle' | 'uploading' | 'done' | 'error'
  const [uploadError, setUploadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Each upload gets a number. If the user picks a second photo while the
  // first is still uploading, the first one's result is ignored when it lands.
  const uploadSeq = useRef(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api('/postcards/today').catch((err) => (err.status === 404 ? null : Promise.reject(err))),
      api('/templates'),
    ])
      .then(([today, templateList]) => {
        if (cancelled) return
        setTodayPostcard(today)
        setTemplates(templateList)
        setInput((current) => ({ ...current, templateId: current.templateId ?? templateList[0]?.id ?? null }))
        setLoadState({ status: 'ready', error: null })
      })
      .catch((err) => !cancelled && setLoadState({ status: 'error', error: err.message }))
    return () => {
      cancelled = true
    }
  }, [])

  // Free the local object URL when it's replaced or the page unmounts.
  useEffect(() => {
    const url = input.localPreviewUrl
    return () => url && URL.revokeObjectURL(url)
  }, [input.localPreviewUrl])

  async function handleFile(file) {
    setUploadError(null)
    setSaveError(null)
    if (!file.type.startsWith('image/')) {
      setUploadError('That file is not an image.')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('That image is over 10 MB. Try a smaller one.')
      return
    }

    const seq = ++uploadSeq.current
    setInput((current) => ({ ...current, imageUrl: '', localPreviewUrl: URL.createObjectURL(file) }))
    setUploadStatus('uploading')
    try {
      const imageUrl = await uploadImage(file)
      if (seq !== uploadSeq.current) return
      setInput((current) => ({ ...current, imageUrl }))
      setUploadStatus('done')
    } catch (err) {
      if (seq !== uploadSeq.current) return
      setUploadStatus('error')
      setUploadError(err.message)
    }
  }

  const selectedTemplate = templates.find((t) => t.id === input.templateId)
  const canSave =
    Boolean(input.imageUrl && selectedTemplate) &&
    uploadStatus !== 'uploading' &&
    input.caption.length <= CAPTION_MAX &&
    !saving

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setSaveError(null)
    try {
      const created = await api('/postcards', {
        method: 'POST',
        body: { imageUrl: input.imageUrl, caption: input.caption, templateId: input.templateId },
      })
      addPostcard(created)
      navigate('/gallery')
    } catch (err) {
      setSaving(false)
      if (err.status === 409) {
        // Made in another tab since this page loaded: show that one instead.
        setTodayPostcard(await api('/postcards/today').catch(() => null))
      }
      setSaveError(err.message)
    }
  }

  if (loadState.status === 'loading') {
    return (
      <div className="flex justify-center py-16">
        <Spinner label="Loading today's postcard" />
      </div>
    )
  }

  if (loadState.status === 'error') {
    return (
      <div role="alert" className="space-y-4 rounded-xl bg-surface p-6">
        <h1 className="text-heading">Couldn't load today's postcard</h1>
        <p>{loadState.error}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    )
  }

  if (todayPostcard) {
    return (
      <div className="space-y-8">
        <TodayStatusBar done />
        {saveError && <p role="alert">{saveError}</p>}
        <div className="mx-auto max-w-2xl space-y-8">
          <PostcardPreview
            heading="Today's postcard"
            imageUrl={todayPostcard.imageUrl}
            caption={todayPostcard.caption}
            templateSlug={todayPostcard.templateSlug}
            dateLabel={formatPostcardDate(todayPostcard.date)}
          />
          <p className="text-center">
            You're done for today. Come back tomorrow, or{' '}
            <Link to="/gallery" className="font-semibold text-primary-strong underline">
              look through your gallery
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  const hint = !input.imageUrl
    ? uploadStatus === 'uploading'
      ? 'Waiting for the upload to finish…'
      : 'Add a photo to save your postcard.'
    : 'Ready when you are.'

  return (
    // Extra bottom padding on phones so the fixed save bar never covers the form.
    <div className="space-y-8 pb-28 lg:pb-0">
      <TodayStatusBar done={false} />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <CaptureForm
          input={input}
          templates={templates}
          uploadStatus={uploadStatus}
          uploadError={uploadError}
          onFile={handleFile}
          onChange={(patch) => setInput((current) => ({ ...current, ...patch }))}
        />

        <div className="min-w-0 space-y-4 lg:sticky lg:top-8">
          <PostcardPreview
            imageUrl={input.imageUrl || input.localPreviewUrl}
            caption={input.caption}
            templateSlug={selectedTemplate?.slug}
            dateLabel={formatLongDate()}
          />

          <div className="fixed inset-x-0 bottom-0 z-10 space-y-1 border-t border-primary/40 bg-bg px-6 py-3 lg:static lg:rounded-xl lg:border-0 lg:bg-surface lg:p-4">
            <Button variant="accent" className="w-full" onClick={handleSave} disabled={!canSave}>
              {saving ? <Spinner label="Saving" /> : null}
              {saving ? 'Saving…' : 'Save postcard'}
            </Button>
            <p className="text-center text-small text-primary-strong" aria-live="polite">
              {saveError ? (
                <span role="alert" className="font-semibold text-red-800">
                  {saveError}
                </span>
              ) : (
                hint
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
