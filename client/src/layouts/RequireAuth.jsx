import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/auth.js'
import { PostcardsProvider } from '../context/PostcardsContext.jsx'
import Spinner from '../components/atoms/Spinner.jsx'

// Guards every journal page. Logged-out visitors go to /login, which sends
// them back here afterwards. The postcards are only loaded once we know who
// is logged in, and are thrown away (unmounted) when they log out.
export default function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking your login" />
      </div>
    )
  }

  if (status === 'out') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <PostcardsProvider>
      <Outlet />
    </PostcardsProvider>
  )
}
