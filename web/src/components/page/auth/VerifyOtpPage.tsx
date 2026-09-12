import { Mail } from 'lucide-react';
import type * as React from 'react';
import { VerifyOtpForm, type VerifyOtpFormProps } from '@/components/organisms/auth/VerifyOtpForm';
import { AuthTemplate } from '@/components/templates/auth/AuthTemplate';

export interface VerifyOtpPageProps extends VerifyOtpFormProps {
  onNavigateToLogin?: () => void;
}

function maskEmail(email: string): string {
  if (!email) return 'a***@gmail.com';
  const parts = email.split('@');
  if (parts.length < 2) return email;
  const name = parts[0] ?? '';
  const domain = parts[1] ?? '';
  const maskedName = name.length > 1 ? `${name[0]}***` : `${name}***`;
  return `${maskedName}@${domain}`;
}

export function VerifyOtpPage({ onNavigateToLogin, ...formProps }: VerifyOtpPageProps) {
  const masked = maskEmail(formProps.values.email);

  return (
    <AuthTemplate
      variant="centered"
      icon={
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100/80 text-teal-600 shadow-2xs">
          <Mail className="w-8 h-8" />
          <span className="absolute 1 -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-2 ring-white" />
        </div>
      }
      badge="Verifikasi Email"
      title="Verifikasi Email Kamu"
      description="Kami telah mengirimkan kode verifikasi ke email kamu:"
      maskedEmail={masked}
    >
      <VerifyOtpForm {...formProps} />
    </AuthTemplate>
  );
}
