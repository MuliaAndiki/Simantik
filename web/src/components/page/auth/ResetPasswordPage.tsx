import type * as React from 'react';
import {
  ResetPasswordForm,
  type ResetPasswordFormProps,
} from '@/components/organisms/auth/ResetPasswordForm';
import { AuthTemplate } from '@/components/templates/auth/AuthTemplate';

export interface ResetPasswordPageProps extends ResetPasswordFormProps {
  onNavigateToLogin?: () => void;
}

export function ResetPasswordPage({ onNavigateToLogin, ...formProps }: ResetPasswordPageProps) {
  return (
    <AuthTemplate
      variant="centered"
      badge="Atur Ulang Password"
      title="Buat Password Baru"
      description="Masukkan password baru untuk akun SIMANTIK Anda"
      footerText="Batal ubah password?"
      footerLinkText="Kembali ke Masuk"
      footerLinkHref="/login"
      onFooterLinkClick={onNavigateToLogin}
    >
      <ResetPasswordForm {...formProps} />
    </AuthTemplate>
  );
}
