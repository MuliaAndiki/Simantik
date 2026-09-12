'use client';

import { useEffect, useRef } from 'react';

// ponytail: deklarasi minimum GIS; pindah ke src/types kalau ada pemakai lain di luar auth
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

/**
 * Memuat Google Identity Services dan merender tombol resmi Google ke div
 * yang dikembalikan ref-nya. Credential diteruskan ke callback.
 * Return null ref saat client ID belum dikonfigurasi.
 */
export function useGoogleSignIn(onCredential: (idToken: string) => void) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const cbRef = useRef(onCredential);
  cbRef.current = onCredential;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return;

    const renderGoogleButton = () => {
      const gsi = window.google?.accounts.id;
      if (!gsi || !buttonRef.current) return;
      gsi.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => cbRef.current(response.credential),
      });
      gsi.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'rounded_rect',
        text: 'continue_with',
        locale: 'id',
      });
    };

    if (window.google?.accounts.id) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = renderGoogleButton;
    document.head.appendChild(script);
  }, []);

  return { buttonRef, enabled: !!GOOGLE_CLIENT_ID };
}
