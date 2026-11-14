import type * as React from 'react';
import { LoginForm, type LoginFormProps } from '@/components/organisms/auth/LoginForm';
import { AuthTemplate } from '@/components/templates/auth/AuthTemplate';

export interface LoginPageProps extends LoginFormProps {
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
  googleSlot?: React.ReactNode;
}

export function LoginPage({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  googleSlot,
  ...formProps
}: LoginPageProps) {
  return (
    <AuthTemplate
      variant="split"
      heroTitle={
        <>
          Belajar lebih terarah <span className="text-teal-700">bersama SIMANTIK</span>
        </>
      }
      heroDescription="Masuk untuk belajar, latihan, cek kemampuan, dan tahu apa yang perlu kamu tingkatkan."
      title="Masuk ke SIMANTIK"
      description="Masuk untuk melanjutkan perjalanan belajarmu"
    >
      <LoginForm
        {...formProps}
        onNavigateToRegister={onNavigateToRegister}
        onNavigateToForgotPassword={onNavigateToForgotPassword}
        googleSlot={googleSlot}
      />
    </AuthTemplate>
  );
}
