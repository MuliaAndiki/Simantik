'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SidebarProvider } from '@/components/atoms';
import { PWAUpdatePrompt } from '@/components/pwa/PWAUpdatePrompt';
import { AuthProvider } from '@/core/providers/auth.provider';
import { LenisProvider } from '@/core/providers/lenis.provinder';
import { ThemeProvider } from '@/core/providers/theme.provider';
import { AlertProvinder } from '@/hooks/useService/useAlert/costum-alert';
import { ReactQueryClientProvider } from '@/pkg/react-query/query-client.pkg';
import { composeProviders } from './composeProvinders';

const Providers = composeProviders([
  ({ children }) => <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>,

  AuthProvider,
  ThemeProvider,
  AlertProvinder,
  LenisProvider,
  ReactQueryClientProvider,
]);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <PWAUpdatePrompt />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </Providers>
  );
}
