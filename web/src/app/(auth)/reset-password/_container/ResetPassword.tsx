'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ResetPasswordPage } from '@/components/page/auth/ResetPasswordPage';
import { useApi } from '@/hooks/useApi';
import { useAuthForm } from '@/hooks/useAuthForm';
import { type ResetPasswordFormData, resetPasswordSchema } from '@/schemas/auth/auth.schema';

export default function ContainerResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token') ?? '';

  const resetPassword = useApi().auth.mutate.resetPassword();
  const { values, errors, onChange, validate } = useAuthForm<typeof resetPasswordSchema>(
    resetPasswordSchema,
    { resetToken, newPassword: '', confirmPassword: '' } as ResetPasswordFormData
  );

  const handleSubmit = () => {
    const data = validate();
    if (!data) return;

    resetPassword.mutate(
      { resetToken: data.resetToken, newPassword: data.newPassword },
      {
        onSuccess: () => {
          router.replace('/login');
        },
      }
    );
  };

  return (
    <ResetPasswordPage
      values={values}
      errors={errors}
      loading={resetPassword.isPending}
      onChange={onChange}
      onSubmit={handleSubmit}
    />
  );
}
