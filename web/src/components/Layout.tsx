import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Layout({ children }: { children: ReactNode }) {
  const { dark, toggle } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={dark ? 'dark' : ''}>
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-primary-dark dark:text-primary-light"
          >
            PrizePicks
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <nav
              className={`transform md:transform-none ${
                menuOpen ? 'block' : 'hidden'
              } md:block`}
            >
              <ul className="flex flex-col md:flex-row md:space-x-6 text-gray-700 dark:text-gray-200">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/admin">Admin</Link>
                </li>
                <li>
                  <Link to="/profile">My Picks</Link>
                </li>
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
  );
}
