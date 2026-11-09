'use client';

import dynamic from 'next/dynamic';
import { SidebarProvider } from '@/components/atoms';
import { PWAUpdatePrompt } from '@/components/pwa/PWAUpdatePrompt';
import { AuthProvider } from '@/core/providers/auth.provider';
import { LenisProvider } from '@/core/providers/lenis.provinder';
import { ThemeProvider } from '@/core/providers/theme.provider';
import { AlertProvinder } from '@/hooks/useService/useAlert/costum-alert';
import { ReactQueryClientProvider } from '@/pkg/react-query/query-client.pkg';
import { composeProviders } from './composeProvinders';

// Dynamically load ReactQueryDevtools in development with chunk load error protection
const SafeReactQueryDevtools = dynamic(
  () =>
    process.env.NODE_ENV === 'production'
      ? Promise.resolve(() => null)
      : import('@tanstack/react-query-devtools')
          .then((d) => d.ReactQueryDevtools)
          .catch((err) => {
            console.warn('ReactQueryDevtools chunk skipped:', err);
            return () => null;
          }),
  { ssr: false }
);

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
      {process.env.NODE_ENV === 'development' && <SafeReactQueryDevtools initialIsOpen={false} />}
    </Providers>
  );
}
