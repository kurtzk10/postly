import { api } from './client.js'

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

// Uploads an image straight from the browser to Cloudinary and resolves with
// its https URL. First it asks OUR server for a signature (only logged-in
// users get one). Cloudinary checks that signature, so nobody can upload to
// this account without logging in, and the API secret never reaches the browser.
export async function uploadImage(file) {
  const { cloudName, apiKey, timestamp, signature, folder, allowed_formats } = await api('/uploads/signature', {
    method: 'POST',
  })

  const form = new FormData()
  form.append('file', file)
  form.append('api_key', apiKey)
  form.append('timestamp', timestamp)
  form.append('signature', signature)
  form.append('folder', folder)
  form.append('allowed_formats', allowed_formats)

  let res
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
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
