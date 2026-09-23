import { createContext, useContext } from 'react'

export const PostcardsContext = createContext(null)

export function usePostcards() {
  const value = useContext(PostcardsContext)
  if (!value) throw new Error('usePostcards must be used inside <PostcardsProvider>')
  return value
}
