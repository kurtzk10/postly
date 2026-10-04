// Empty by default: the API is on the same address as the app (Vite's proxy
// in development, the same Vercel domain once deployed).
const API_URL = import.meta.env.VITE_API_URL ?? ''

// Calls the Express API. Throws an Error carrying the server's message and
// HTTP status, so callers can show it or branch on it (e.g. 404, 409).
export async function api(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      credentials: 'include', // send the login cookie even if VITE_API_URL points elsewhere
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw Object.assign(new Error("Can't reach the Postly server. Is it running?"), { status: 0 })
  }

  // A 401 from anything but the login routes means the session has ended
  // (logged out elsewhere, or expired): tell the app so it shows the login page.
  if (res.status === 401 && !path.startsWith('/auth')) {
    window.dispatchEvent(new Event('postly:logged-out'))
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw Object.assign(new Error(data?.error || `Request failed (${res.status})`), { status: res.status })
  }
  return data
}
