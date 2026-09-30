'use client';

import React from 'react';
import { LoginPage } from '@/components/page/auth/LoginPage';
import { useApi } from '@/hooks/useApi';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { type LoginFormData, loginSchema } from '@/schemas/auth/auth.schema';
import {
  clearRememberedEmail,
  getRememberedEmail,
  setRememberedEmail,
  setRememberMeFlag,
  setSessionCookies,
  shouldPersistSession,
} from '@/utils/session-cookie';

// ponytail: redirect pasca-login diputuskan di hooks auth (routeAfterAuth),
// container hanya menyimpan sesi cookie.
export default function ContainerLogin() {
  const { mutate } = useApi().auth;
  const login = mutate.login();
  const googleLogin = mutate.googleLogin();
  const { values, errors, onChange, validate } = useAuthForm<typeof loginSchema>(loginSchema, {
    email: '',
    password: '',
  } as LoginFormData);

  const [rememberMe, setRememberMe] = React.useState<boolean>(() => shouldPersistSession());
  const emailPrefilled = React.useRef(false);

  // Prefill email tersimpan ("Ingat saya" login sebelumnya). Sekali saat mount
  // agar tidak menimpa ketikan user.
  React.useEffect(() => {
    if (emailPrefilled.current) return;
    emailPrefilled.current = true;
    const saved = getRememberedEmail();
    if (saved) onChange('email', saved);
  });

  const persistChoice = (remember: boolean, email: string) => {
    setRememberMeFlag(remember);
    if (remember && email.trim() !== '') {
      setRememberedEmail(email.trim());
    } else {
      clearRememberedEmail();
    }
  };

  const handleGoogleCredential = (idToken: string) => {
    const remember = rememberMe;
    googleLogin.mutate(
      { idToken },
      {
        onSuccess: (res) => {
          if (!res.data) return;
          persistChoice(remember, values.email);
          setSessionCookies({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken ?? undefined,
            role: res.data.user.role,
            persistent: remember,
          });
        },
      }
    );
  };

  const { buttonRef, enabled } = useGoogleSignIn(handleGoogleCredential);

  const handleSubmit = () => {
    const data = validate();
    if (!data) return;
    const remember = rememberMe;

    login.mutate(data, {
      onSuccess: (res) => {
        if (!res.data) return;
        persistChoice(remember, data.email);
        setSessionCookies({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken ?? undefined,
          role: res.data.user.role,
          persistent: remember,
        });
      },
    });
  };

  return (
    <LoginPage
      values={values}
      errors={errors}
      loading={login.isPending}
      rememberMe={rememberMe}
      onRememberMeChange={setRememberMe}
      onChange={onChange}
      onSubmit={handleSubmit}
      googleSlot={enabled ? <div ref={buttonRef} /> : undefined}
    />
  );
}
