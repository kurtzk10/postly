import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/auth.js'
import Logo from '../components/atoms/Logo.jsx'
import Spinner from '../components/atoms/Spinner.jsx'

// Frame for /login and /signup. Someone already logged in is sent on to the
// page they were trying to reach (or today's postcard).
export default function AuthLayout() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'in') {
    return <Navigate to={location.state?.from ?? '/capture'} replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10 sm:justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <main className="rounded-xl bg-surface p-6">
          {status === 'loading' ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
