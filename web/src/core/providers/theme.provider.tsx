'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { themeConfig } from '@/configs/theme.config';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Enforce single white/light theme across the application
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');

    // Apply CSS custom properties from the single white theme configuration
    Object.entries(themeConfig).forEach(([key, value]) => {
      if (typeof value === 'string') {
        document.documentElement.style.setProperty(`--${key}`, value);
      } else if (
        value &&
        typeof value === 'object' &&
        'background' in value &&
        'foreground' in value
      ) {
        document.documentElement.style.setProperty(
          `--${key}`,
          (value as { background: string }).background
        );
        document.documentElement.style.setProperty(
          `--${key}-foreground`,
          (value as { foreground: string }).foreground
        );
      }
    });
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
