// True when the browser can show a live camera preview (needs https or localhost).
export const cameraSupported = Boolean(navigator.mediaDevices?.getUserMedia)
