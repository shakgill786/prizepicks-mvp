import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useDarkMode } from '../hooks/useDarkMode'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }: { children: ReactNode }) {
  const { dark, toggle } = useDarkMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const staticLinks = [{ label: 'Home', to: '/' }]

  let authLinks = user
    ? [
        { label: 'My Picks', to: '/mypicks' },      // ← point at the MyPicksPage route
        ...(user.isAdmin ? [{ label: 'Admin', to: '/admin' }] : []),
      ]
    : [
        { label: 'Log In', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
      ]

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
            <button
              onClick={() => setMenuOpen(!menuOpen)}
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
            <nav className={`${menuOpen ? 'block' : 'hidden'} md:block`}>
              <ul className="flex flex-col md:flex-row md:space-x-6 text-gray-700 dark:text-gray-200">
                {staticLinks.concat(authLinks).map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="block px-2 py-1 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          logout()
                          setMenuOpen(false)
                          navigate('/login')
                        }}
                        className="block px-2 py-1 focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
                      >
                        Log Out
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
