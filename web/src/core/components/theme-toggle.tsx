'use client';

import { Icon } from '@iconify/react/dist/iconify.js';

import { Button } from '@/components/atoms';
import { useTheme } from '@/core/providers/theme.provider';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-9 rounded-md"
      aria-label="Light theme"
    >
      <Icon icon="iconamoon:mode-light" className="size-5" />
    </Button>
  );
}
