import type { Metadata } from 'next';
import { AppShell } from '@/core/layouts/app-shell.layout';
import PrivateProviders from '@/core/providers/private.provider';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateProviders>
      <AppShell>{children}</AppShell>
    </PrivateProviders>
  );
}
