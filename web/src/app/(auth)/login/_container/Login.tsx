'use client';

import { LoginPage } from '@/components/page/auth/LoginPage';
import { useApi } from '@/hooks/useApi';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { type LoginFormData, loginSchema } from '@/schemas/auth/auth.schema';
import { setSessionCookies } from '@/utils/session-cookie';

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

  const handleGoogleCredential = (idToken: string) => {
    googleLogin.mutate(
      { idToken },
      {
        onSuccess: (res) => {
          if (!res.data) return;
          setSessionCookies({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken ?? undefined,
            role: res.data.user.role,
          });
        },
      }
    );
  };

  const { buttonRef, enabled } = useGoogleSignIn(handleGoogleCredential);

  const handleSubmit = () => {
    const data = validate();
    if (!data) return;

    login.mutate(data, {
      onSuccess: (res) => {
        if (!res.data) return;
        setSessionCookies({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken ?? undefined,
          role: res.data.user.role,
        });
      },
    });
  };

  return (
    <LoginPage
      values={values}
      errors={errors}
      loading={login.isPending}
      onChange={onChange}
      onSubmit={handleSubmit}
      googleSlot={enabled ? <div ref={buttonRef} /> : undefined}
    />
  );
}
