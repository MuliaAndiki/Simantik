import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRoleDashboardPath } from '@/configs/app.config';
import { APP_SESSION_COOKIE_ROLE } from '@/configs/cookies.config';

/**
 * Guard role sisi server untuk halaman privat.
 *
 * Sidebar hanya menyembunyikan menu — tanpa guard ini, user yang mengetik
 * URL manual (mis. /admin/students sebagai content_manager) tetap bisa
 * me-render halaman. Guard me-redirect ke dashboard role masing-masing.
 */
export default async function RoleGuard({
  allowed,
  children,
}: {
  allowed: string[];
  children: React.ReactNode;
}) {
  const store = await cookies();
  const role = (store.get(APP_SESSION_COOKIE_ROLE)?.value || '').toLowerCase();
  const normAllowed = allowed.map((r) => r.toLowerCase());

  if (!normAllowed.includes(role)) {
    redirect(getRoleDashboardPath(role || undefined));
  }

  return <>{children}</>;
}
