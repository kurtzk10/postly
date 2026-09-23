import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { PostcardsContext } from './postcards.js'

// App-level owner of the postcards list. Gallery, streaks and capsule all
// read from here, so a save or delete updates every screen at once.
export function PostcardsProvider({ children }) {
  const [postcards, setPostcards] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState(null)

  // Bumping this re-runs the fetch effect below.
  const [loadCount, setLoadCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    api('/postcards')
      .then((list) => {
        if (cancelled) return
        setPostcards(list)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [loadCount])

  const reload = useCallback(() => {
    setStatus('loading')
    setLoadCount((n) => n + 1)
  }, [])

  const addPostcard = useCallback((postcard) => {
    setPostcards((list) => [postcard, ...list])
  }, [])

  const removePostcard = useCallback((id) => {
    setPostcards((list) => list.filter((p) => p.id !== id))
  }, [])

  return (
    <PostcardsContext.Provider value={{ postcards, status, error, reload, addPostcard, removePostcard }}>
      {children}
    </PostcardsContext.Provider>
  )
}
