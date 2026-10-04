import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/auth.js'
import Logo from '../atoms/Logo.jsx'
import AppNavLink from '../atoms/AppNavLink.jsx'
import Button from '../atoms/Button.jsx'

const LINKS = [
  { to: '/capture', label: 'Today' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/streaks', label: 'Streaks' },
  { to: '/capsule', label: 'Capsule' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    closeMenu()
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-primary/40 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Logo />

        <button
          type="button"
          className="rounded-lg px-3 py-1 text-heading sm:hidden"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <nav
          id="main-nav"
          aria-label="Main"
          className={`${menuOpen ? 'block' : 'hidden'} absolute inset-x-0 top-16 z-20 border-b border-primary/40 bg-surface px-6 pb-4 sm:static sm:block sm:border-0 sm:p-0`}
        >
          <ul className="flex flex-col gap-2 sm:flex-row sm:gap-1 lg:gap-2">
            {LINKS.map((link) => (
              <li key={link.to}>
                <AppNavLink to={link.to} onClick={closeMenu}>
                  {link.label}
                </AppNavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-primary/40 pt-4 sm:hidden">
            <span className="min-w-0 truncate text-small">{user?.email}</span>
            <Button variant="ghost" className="shrink-0" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </nav>

        <div className="hidden min-w-0 items-center gap-3 sm:flex">
          <span className="hidden max-w-48 truncate text-small lg:inline" title={user?.email}>
            {user?.email}
          </span>
          {/* Narrower padding between 640 and 1024px so the row still fits. */}
          <Button variant="ghost" className="shrink-0 px-3! lg:px-5!" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
