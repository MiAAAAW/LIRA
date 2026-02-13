/**
 * @fileoverview Theme Hook for Dark/Light/System Mode
 * @description Manages theme state with localStorage persistence and system preference detection
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Get the resolved theme based on system preference
 * @returns {'light' | 'dark'}
 */
const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * useTheme - Hook for managing dark/light/system mode
 *
 * @returns {{
 *   theme: 'light' | 'dark' | 'system',
 *   resolvedTheme: 'light' | 'dark',
 *   setTheme: (theme: 'light' | 'dark' | 'system') => void,
 *   toggleTheme: () => void,
 *   isDark: boolean,
 *   isLight: boolean,
 *   mounted: boolean
 * }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState('dark');
  const [resolvedTheme, setResolvedTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  /**
   * Apply theme to document
   * @param {'light' | 'dark'} newTheme
   */
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setResolvedTheme(newTheme);
  }, []);

  /**
   * Resolve and apply the effective theme
   * @param {'light' | 'dark' | 'system'} themeValue
   */
  const resolveAndApply = useCallback((themeValue) => {
    const effectiveTheme = themeValue === 'system' ? getSystemTheme() : themeValue;
    applyTheme(effectiveTheme);
  }, [applyTheme]);

  // Initialize theme from localStorage or default to system
  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem('pandilla-theme');
    const initialTheme = (stored === 'dark' || stored === 'light' || stored === 'system')
      ? stored
      : 'dark';

    setThemeState(initialTheme);
    resolveAndApply(initialTheme);
  }, [resolveAndApply]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Only update if theme is set to 'system'
      if (theme === 'system') {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  /**
   * Set theme and persist to localStorage
   * @param {'light' | 'dark' | 'system'} newTheme
   */
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('pandilla-theme', newTheme);
    resolveAndApply(newTheme);
  }, [resolveAndApply]);

  /**
   * Toggle between light and dark (skips system)
   */
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    mounted,
  };
}

export default useTheme;
