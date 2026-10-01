'use client';

import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';
import { setAuthErrorHandler } from '@/api/client/client-http';
import { clearSessionCookies, getAccessToken, getRefreshToken } from '@/utils/session-cookie';

const PUBLIC_PATHS = [
  '/',
  '/home',
  '/documentation',
  '/tutorials',
  '/testimonials',
  '/news',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/help',
  '/privacy',
  '/terms',
  '/verify-email',
  '/auth',
  '/magic-link',
  '/coming-soon',
  '/desain',
  '/illustrations',
  '/images',
  '/avatars',
];

/**
 * Check if the given pathname is public (accessible without login).
 * Root '/' matches only exact '/', while other paths match exact or child paths.
 */
export function isPublicRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  return PUBLIC_PATHS.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

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
    const isPublic = isPublicRoute(pathname);
    const hasSession = Boolean(getAccessToken() || getRefreshToken());

    if (!isPublic && !hasSession) {
      router.replace('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
