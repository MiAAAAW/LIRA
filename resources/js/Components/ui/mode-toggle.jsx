/**
 * @fileoverview Mode Toggle Component
 * @description Simple theme switcher button that cycles through Light/Dark/System
 */

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

/**
 * ModeToggle - Theme switcher button
 * Cycles through: System → Light → Dark → System...
 */
export function ModeToggle({ className }) {
  const { theme, setTheme, mounted } = useTheme();

  // Cycle through themes
  const cycleTheme = React.useCallback(() => {
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  }, [theme, setTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("h-9 w-9", className)}>
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={cn("h-9 w-9 hover:bg-accent", className)}
      title={`Theme: ${theme} (click to change)`}
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4 text-primary" />
      ) : theme === 'system' ? (
        <Monitor className="h-4 w-4 text-primary" />
      ) : (
        <Sun className="h-4 w-4 text-primary" />
      )}
      <span className="sr-only">Toggle theme ({theme})</span>
    </Button>
  );
}

export default ModeToggle;
