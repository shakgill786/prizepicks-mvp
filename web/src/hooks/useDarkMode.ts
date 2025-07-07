import { useEffect, useState, useCallback } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    // fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply `dark` class on html
  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((d) => !d);
  }, []);

  return { dark, toggle };
}
