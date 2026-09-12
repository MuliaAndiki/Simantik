'use client';

import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';
import { setAuthErrorHandler } from '@/api/client/client-http';
import { clearSessionCookies, getAccessToken, getRefreshToken } from '@/utils/session-cookie';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/help',
  '/privacy',
  '/terms',
  '/verify-email',
  '/auth/verify-email',
  '/magic-link',
  '/auth/magic-link',
  '/home',
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // 401 (access token invalid/expired & refresh gagal) → bersihkan + ke /login.
  useEffect(() => {
    const handleAuthError = () => {
      clearSessionCookies();
      if (!pathname?.startsWith('/login')) {
        window.location.assign('/login');
      }
    };

    setAuthErrorHandler(handleAuthError);
    return () => setAuthErrorHandler(null);
  }, [pathname]);

  // Guard klien: redirect bila tidak ada access/refresh token di area privat.
  // Jika hanya refresh token yang tersisa, biarkan berjalan — client-http akan
  // memanggil POST /auth/refresh-token untuk memperbarui access token.
  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname?.startsWith(path));
    const hasSession = Boolean(getAccessToken() || getRefreshToken());

    if (!isPublicPath && !hasSession) {
      router.replace('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
