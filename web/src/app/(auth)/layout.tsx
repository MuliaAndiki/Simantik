import AuthLayoutRoot from '@/core/layouts/auth.layout';
import BlankLayout from '@/core/layouts/blank.layout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <BlankLayout>
        <AuthLayoutRoot>{children}</AuthLayoutRoot>
      </BlankLayout>
    </main>
  );
}
