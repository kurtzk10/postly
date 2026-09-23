import { useState } from 'react'
import Logo from '../atoms/Logo.jsx'
import AppNavLink from '../atoms/AppNavLink.jsx'

const LINKS = [
  { to: '/capture', label: 'Today' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/streaks', label: 'Streaks' },
  { to: '/capsule', label: 'Capsule' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

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
          <ul className="flex flex-col gap-2 sm:flex-row">
            {LINKS.map((link) => (
              <li key={link.to}>
                <AppNavLink to={link.to} onClick={closeMenu}>
                  {link.label}
                </AppNavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
