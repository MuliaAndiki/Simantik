/**
 * SIMANTIK Theme Configuration
 * Based on design specifications from `tka.educourse.id-DESIGN.md`.
 * Configured as a single White / Light Theme.
 */

export interface ColorConfig {
  background: string;
  foreground: string;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  card: ColorConfig;
  popover: ColorConfig;
  primary: ColorConfig;
  secondary: ColorConfig;
  muted: ColorConfig;
  accent: ColorConfig;
  destructive: ColorConfig;
  warning: ColorConfig;
  success: ColorConfig;
  info: ColorConfig;
  border: string;
  input: string;
  ring: string;

  // Extended Brand & Design System Tokens (from tka.educourse.id-DESIGN.md)
  canvas: string;
  surfaceAlt: string;
  onPrimary: string;
  ink: string;
  body: string;
  faint: string;
  link: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  neutral1: string;
  neutral2: string;
}

const whiteTheme: ThemeColors = {
  background: '#FAFCFD', // Canvas: light cool foundation surface
  foreground: '#111827', // Ink: deep charcoal-black for maximum contrast & readability

  card: {
    background: '#FFFFFF',
    foreground: '#111827',
  },
  popover: {
    background: '#FFFFFF',
    foreground: '#111827',
  },
  primary: {
    background: '#F7CE46', // Brand golden yellow (CTA, primary buttons)
    foreground: '#1A4D5C', // On-primary: Deep teal-grey for contrast
  },
  secondary: {
    background: '#E0F7FA', // Accent-3: Soft cyan tint
    foreground: '#1A4D5C', // Deep teal
  },
  muted: {
    background: '#F3F4F6',
    foreground: '#595959', // Muted text, captions
  },
  accent: {
    background: '#E0F7FA', // Accent-3: Soft cyan
    foreground: '#4CA7B1', // Accent-2: Vibrant teal
  },
  destructive: {
    background: '#DC2626', // Red accent for danger/delete
    foreground: '#FFFFFF',
  },
  warning: {
    background: '#FECA13',
    foreground: '#1A4D5C',
  },
  success: {
    background: '#28DE25',
    foreground: '#FFFFFF',
  },
  info: {
    background: '#0051C3', // Accent-4 deep blue
    foreground: '#FFFFFF',
  },
  border: '#E5E7EB', // Neutral-1: light grey border for cards, inputs, dividers
  input: '#E5E7EB',
  ring: '#F7CE46', // Primary focus ring (golden yellow)

  // Design system specific color tokens
  canvas: '#FAFCFD',
  surfaceAlt: '#1A4D5C',
  onPrimary: '#1A4D5C',
  ink: '#111827',
  body: '#404040',
  faint: '#546A72',
  link: '#8BBCC5',
  accent1: '#7A9099',
  accent2: '#4CA7B1',
  accent3: '#E0F7FA',
  accent4: '#0051C3',
  accent5: '#6B7280',
  neutral1: '#E5E7EB',
  neutral2: '#000000',
};

export type ThemeConfig = ThemeColors & {
  light: ThemeColors;
};

// Export as single white theme with backward compatibility for themeConfig.light
export const themeConfig: ThemeConfig = {
  ...whiteTheme,
  light: whiteTheme,
};
