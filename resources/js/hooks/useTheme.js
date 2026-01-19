/**
 * @fileoverview Theme Hook for Dark/Light Mode
 * @description Manages theme state with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * useTheme - Hook for managing dark/light mode
 *
 * @returns {{
 *   theme: 'light' | 'dark',
 *   setTheme: (theme: 'light' | 'dark') => void,
 *   toggleTheme: () => void,
 *   isDark: boolean,
 *   isLight: boolean,
 *   mounted: boolean
 * }}
 *
 * @example
 * const { theme, toggleTheme, isDark } = useTheme();
 *
 * <button onClick={toggleTheme}>
 *   {isDark ? <Sun /> : <Moon />}
 * </button>
 */
export function useTheme() {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const stored = localStorage.getItem('pandilla-theme');
    if (stored === 'dark' || stored === 'light') {
      setThemeState(stored);
      applyTheme(stored);
      return;
    }

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    setThemeState(systemTheme);
    applyTheme(systemTheme);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      const stored = localStorage.getItem('pandilla-theme');
      // Only auto-switch if user hasn't set a preference
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Apply theme to document
   * @param {'light' | 'dark'} newTheme
   */
  const applyTheme = (newTheme) => {
    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  /**
   * Set theme and persist to localStorage
   * @param {'light' | 'dark'} newTheme
   */
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('pandilla-theme', newTheme);
    applyTheme(newTheme);
  }, []);

  /**
   * Toggle between light and dark
   */
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    mounted,
  };
}

export default useTheme;
