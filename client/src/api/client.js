const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Calls the Express API. Throws an Error carrying the server's message and
// HTTP status, so callers can show it or branch on it (e.g. 404, 409).
export async function api(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw Object.assign(new Error("Can't reach the Postly server. Is it running?"), { status: 0 })
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw Object.assign(new Error(data?.error || `Request failed (${res.status})`), { status: res.status })
  }
  return data
}
