import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { AuthContext } from './auth.js'

// Who is logged in. On first load it asks the server (/auth/me), because the
// session lives in an httpOnly cookie the page itself can't read.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'in' | 'out'

  useEffect(() => {
    let cancelled = false
    api('/auth/me')
      .then((me) => {
        if (cancelled) return
        setUser(me)
        setStatus('in')
      })
      .catch(() => {
        if (cancelled) return
        setUser(null)
        setStatus('out')
      })
    return () => {
      cancelled = true
    }
  }, [])

  // api() fires this when any request comes back 401: the session has ended,
  // so drop the user and let RequireAuth send them to /login.
  useEffect(() => {
    const onLoggedOut = () => {
      setUser(null)
      setStatus('out')
    }
    window.addEventListener('postly:logged-out', onLoggedOut)
    return () => window.removeEventListener('postly:logged-out', onLoggedOut)
  }, [])

  const login = useCallback(async (email, password) => {
    const me = await api('/auth/login', { method: 'POST', body: { email, password } })
    setUser(me)
    setStatus('in')
  }, [])

  const signup = useCallback(async (email, password) => {
    const me = await api('/auth/signup', { method: 'POST', body: { email, password } })
    setUser(me)
    setStatus('in')
  }, [])

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
    setStatus('out')
  }, [])

  return <AuthContext.Provider value={{ user, status, login, signup, logout }}>{children}</AuthContext.Provider>
}
