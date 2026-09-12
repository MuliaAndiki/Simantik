import type * as React from 'react';
import {
  ForgotPasswordForm,
  type ForgotPasswordFormProps,
} from '@/components/organisms/auth/ForgotPasswordForm';
import { AuthTemplate } from '@/components/templates/auth/AuthTemplate';

export interface ForgotPasswordPageProps extends ForgotPasswordFormProps {
  onNavigateToLogin?: () => void;
}

export function ForgotPasswordPage({ onNavigateToLogin, ...formProps }: ForgotPasswordPageProps) {
  return (
    <AuthTemplate
      variant="split"
      heroTitle={
        <>
          Belajar lebih terarah <span className="text-teal-700">bersama SIMANTIK</span>
        </>
      }
      heroDescription="Masuk untuk belajar, latihan, cek kemampuan, dan tahu apa yang perlu kamu tingkatkan."
      badge="Lupa Password?"
      title="Atur ulang password kamu"
      description="Masukkan email atau username yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang password kamu."
    >
      <ForgotPasswordForm {...formProps} onNavigateToLogin={onNavigateToLogin} />
    </AuthTemplate>
  );
}
