'use client';

import { useRouter } from 'next/navigation';
import { ForgotPasswordPage } from '@/components/page/auth/ForgotPasswordPage';
import { useApi } from '@/hooks/useApi';
import { useAuthForm } from '@/hooks/useAuthForm';
import { type ForgotPasswordFormData, forgotPasswordSchema } from '@/schemas/auth/auth.schema';

export default function ContainerForgotPassword() {
  const router = useRouter();
  const forgotPassword = useApi().auth.mutate.forgotPassword();
  const { values, errors, onChange, validate } = useAuthForm<typeof forgotPasswordSchema>(
    forgotPasswordSchema,
    { email: '' } as ForgotPasswordFormData
  );

  const handleSubmit = () => {
    const data = validate();
    if (!data) return;

    forgotPassword.mutate(data, {
      onSuccess: () => {
        router.replace(`/verify-otp?purpose=reset&email=${encodeURIComponent(data.email)}`);
      },
    });
  };

  return (
    <ForgotPasswordPage
      values={values}
      errors={errors}
      loading={forgotPassword.isPending}
      onChange={onChange}
      onSubmit={handleSubmit}
    />
  );
}
