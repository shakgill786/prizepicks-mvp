// web/src/components/Layout.tsx
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../contexts/AuthContext'

type NavItem = {
  label: string
  to?: string
  action?: () => void
}

export default function Layout({ children }: { children: ReactNode }) {
  const { dark, toggle } = useDarkMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // hide the nav bar on login/signup pages
  const hideNav = ['/login', '/signup'].includes(location.pathname)

  // static link always shown
  const staticLinks: NavItem[] = [{ label: 'Home', to: '/' }]

  // links depending on auth state
  const authLinks: NavItem[] = user
    ? [
        { label: 'Profile', to: '/profile' },
        { label: 'My Picks', to: '/mypicks' },
        ...(user.isAdmin ? [{ label: 'Admin', to: '/admin' }] : []),
        { label: 'Log Out', action: logout },
      ]
    : [
        { label: 'Log In', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
      ]

  if (hideNav) {
    return <main>{children}</main>
  }

  return (
    <div className={dark ? 'dark' : ''}>
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-primary-dark dark:text-primary-light focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
          >
            PrizePicks
          </Link>
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
            >
              {dark ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* User avatar & name */}
            {user && (
              <div className="hidden md:flex items-center space-x-2 ml-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="w-8 h-8 bg-gray-300 rounded-full" />
                )}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {user.displayName}
                </span>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            {/* Navigation links */}
            <nav className={`${menuOpen ? 'block' : 'hidden'} md:block`}>
              <ul className="flex flex-col md:flex-row md:space-x-6 text-gray-700 dark:text-gray-200">
                {staticLinks.concat(authLinks).map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-2 py-1 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.action?.()
                          setMenuOpen(false)
                          navigate('/login')
                        }}
                        className="block px-2 py-1 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          © {new Date().getFullYear()} PrizePicks MVP •{' '}
          <Link to="/faq">FAQ</Link> • <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
