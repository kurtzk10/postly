import { NavLink } from 'react-router'

// Named AppNavLink so it doesn't shadow React Router's NavLink.
export default function AppNavLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-full border px-4 py-1.5 sm:px-3 lg:px-4 font-semibold transition ${
          isActive
            ? 'border-primary-strong bg-primary-strong text-white'
            : 'border-primary text-primary-strong hover:bg-surface'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
