const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

// Uploads an image straight from the browser using an unsigned preset and
// resolves with its https URL. No Cloudinary secret ever reaches the client.
export async function uploadImage(file) {
  if (!cloudinaryConfigured) {
    throw new Error('Image uploads are not configured. Set the Cloudinary values in client/.env.')
  }
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)

  let res
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: form,
    })
  } catch {
    throw new Error('Upload failed. Check your connection and try again.')
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Upload failed. Try again.')
  }
  return data.secure_url
}
