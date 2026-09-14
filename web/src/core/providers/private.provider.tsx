import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { APP_SESSION_COOKIE_KEY, APP_SESSION_COOKIE_REFRESH } from '@/configs/cookies.config';

/**
 * Gate server-side untuk area privat.
 *
 * Refresh token TIDAK ditukar di sini: Next.js melarang `cookies().set()`
 * saat render Server Component (hanya boleh di Server Action / Route Handler),
 * dan backend me-rotate refresh token (revoke lama + terbitkan baru). Bila
 * provider menukar token lalu gagal menyimpan cookie baru, token lama yang
 * tersimpan di browser menjadi revoked dan sesi justru rusak.
 *
 * Karena itu:
 * - Tanpa access token dan tanpa refresh token → tidak bisa dipulihkan → /login.
 * - Access token hilang/kedaluwarsa tapi refresh token ada → tetap render;
 *   `client-http` akan menangani 401 dengan menukar refresh token
 *   (POST /auth/refresh) dan menyimpan token hasil rotasi.
 */
export default async function PrivateProviders({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const accessToken = store.get(APP_SESSION_COOKIE_KEY)?.value;
  const refreshToken = store.get(APP_SESSION_COOKIE_REFRESH)?.value;

  if (!accessToken && !refreshToken) {
    redirect('/login');
  }

  return <>{children}</>;
}
