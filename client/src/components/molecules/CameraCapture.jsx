import { useEffect, useRef, useState } from 'react'
import Button from '../atoms/Button.jsx'
import Spinner from '../atoms/Spinner.jsx'

function stopStream(stream) {
  stream?.getTracks().forEach((track) => track.stop())
}

function cameraErrorMessage(err) {
  if (err.name === 'NotAllowedError') {
    return "Camera access was blocked. Allow it in your browser's site settings, or choose a photo instead."
  }
  if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
    return 'No camera was found on this device.'
  }
  if (err.name === 'NotReadableError') {
    return 'The camera is being used by another app. Close it and try again.'
  }
  return "Couldn't start the camera. Choose a photo instead."
}

// A live viewfinder in a modal. Hands a JPEG File to onCapture, exactly like
// a file picked from the gallery, so the upload path is the same for both.
export default function CameraCapture({ onCapture, onClose }) {
  const dialogRef = useRef(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [facing, setFacing] = useState('environment') // back camera first on phones
  const [status, setStatus] = useState('starting') // 'starting' | 'ready' | 'error'
  const [error, setError] = useState(null)
  const [canSwitch, setCanSwitch] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      .then(async (stream) => {
        if (cancelled) return stopStream(stream)
        streamRef.current = stream
        // 'ready' waits for onLoadedData below: until the first frame arrives
        // the video is 0x0 and a snap would produce an empty image.
        videoRef.current.srcObject = stream
        // Device labels and counts are only reliable after permission is granted.
        const devices = await navigator.mediaDevices.enumerateDevices()
        if (!cancelled) setCanSwitch(devices.filter((d) => d.kind === 'videoinput').length > 1)
      })
      .catch((err) => {
        if (cancelled) return
        setStatus('error')
        setError(cameraErrorMessage(err))
      })
    return () => {
      cancelled = true
      stopStream(streamRef.current)
      streamRef.current = null
    }
  }, [facing])

  function close() {
    stopStream(streamRef.current)
    dialogRef.current?.close()
    onClose()
  }

  function switchCamera() {
    setStatus('starting')
    setFacing((f) => (f === 'environment' ? 'user' : 'environment'))
  }

  function snap() {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setStatus('error')
          setError("Couldn't take the photo. Try again.")
          return
        }
        const file = new File([blob], `postly-${Date.now()}.jpg`, { type: 'image/jpeg' })
        close()
        onCapture(file)
      },
      'image/jpeg',
      0.9,
    )
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="camera-heading"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      className="m-0 h-full max-h-none w-full max-w-none bg-text text-bg backdrop:bg-text/80 sm:m-auto sm:h-fit sm:max-w-2xl sm:rounded-xl"
    >
      <div className="flex items-center justify-between px-6 py-3">
        <h2 id="camera-heading" className="text-heading">
          Take today's photo
        </h2>
        <button type="button" onClick={close} aria-label="Close camera" className="rounded-lg px-3 py-1 text-heading">
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="relative flex aspect-[3/4] items-center justify-center bg-black sm:aspect-video">
        {/* The front camera is mirrored on screen like a mirror; the saved photo is not. */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedData={() => setStatus('ready')}
          aria-label="Camera viewfinder"
          className={`h-full w-full object-contain ${facing === 'user' ? '-scale-x-100' : ''} ${status === 'ready' ? '' : 'invisible'}`}
        />
        {status === 'starting' && (
          <div className="absolute">
            <Spinner label="Starting camera" />
          </div>
        )}
        {status === 'error' && (
          <p role="alert" className="absolute px-6 text-center">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 px-6 py-4">
        {canSwitch && (
          <Button variant="ghost" onClick={switchCamera} disabled={status === 'starting'}>
            Switch camera
          </Button>
        )}
        <Button variant="accent" onClick={snap} disabled={status !== 'ready'}>
          Take photo
        </Button>
      </div>
    </dialog>
  )
}
