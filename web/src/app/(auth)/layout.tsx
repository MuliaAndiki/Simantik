import type { Metadata } from 'next';
import AuthLayoutRoot from '@/core/layouts/auth.layout';
import BlankLayout from '@/core/layouts/blank.layout';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <BlankLayout>
        <AuthLayoutRoot>{children}</AuthLayoutRoot>
      </BlankLayout>
    </main>
  );
}
