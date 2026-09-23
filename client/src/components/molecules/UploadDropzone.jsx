import { useId, useRef, useState } from 'react'
import Button from '../atoms/Button.jsx'
import Spinner from '../atoms/Spinner.jsx'
import CameraCapture from './CameraCapture.jsx'
import { cameraSupported } from '../../lib/camera.js'

// Presentational: reports the chosen file up to CapturePage, which owns the
// upload itself so the save button can read uploadStatus.
export default function UploadDropzone({ previewUrl, uploadStatus, error, onFile }) {
  const inputId = useId()
  const [dragging, setDragging] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  // Fallback for browsers without getUserMedia: capture="environment" asks
  // the phone to open its own camera app instead of the photo library.
  const nativeCameraRef = useRef(null)

  function handlePicked(e) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = '' // lets the same file be picked again after an error
  }

  function openCamera() {
    if (cameraSupported) setCameraOpen(true)
    else nativeCameraRef.current.click()
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center gap-4 rounded-xl border-2 border-dashed p-6 text-center transition ${
        dragging ? 'border-primary-strong bg-bg' : 'border-primary'
      }`}
    >
      {previewUrl ? (
        <div className="relative w-full max-w-xs">
          <img src={previewUrl} alt="Your photo for today" className="aspect-[3/2] w-full rounded-md object-cover" />
          {uploadStatus === 'uploading' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-bg/70">
              <Spinner label="Uploading photo" />
            </div>
          )}
        </div>
      ) : (
        <p className="font-semibold">
          <span className="hidden lg:inline">Drop today's photo here</span>
          <span className="lg:hidden">Add today's photo</span>
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="ghost" onClick={openCamera}>
          {previewUrl ? 'Retake photo' : 'Take a photo'}
        </Button>
        {/* The visible button is the label, so the native file input keeps keyboard and screen-reader support. */}
        <label
          htmlFor={inputId}
          className="cursor-pointer rounded-full border border-primary bg-bg px-5 py-2 font-semibold text-primary-strong transition hover:bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-strong"
        >
          {previewUrl ? 'Choose a different photo' : 'Choose a photo'}
          <input id={inputId} type="file" accept="image/*" className="sr-only" onChange={handlePicked} />
        </label>
        <input
          ref={nativeCameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handlePicked}
        />
      </div>

      {cameraOpen && <CameraCapture onCapture={onFile} onClose={() => setCameraOpen(false)} />}

      <p className="text-small text-primary-strong" aria-live="polite">
        {uploadStatus === 'uploading' && 'Uploading to Cloudinary…'}
        {uploadStatus === 'done' && 'Uploaded.'}
        {uploadStatus === 'idle' && 'JPG, PNG or WebP, up to 10 MB'}
      </p>
      {error && (
        <p role="alert" className="text-small font-semibold text-red-800">
          {error}
        </p>
      )}
    </div>
  )
}
