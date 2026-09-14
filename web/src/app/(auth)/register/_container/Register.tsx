'use client';

import { useRouter } from 'next/navigation';
import { RegisterPage } from '@/components/page/auth/RegisterPage';
import { useApi } from '@/hooks/useApi';
import { useAuthForm } from '@/hooks/useAuthForm';
import { type RegisterFormData, registerSchema } from '@/schemas/auth/auth.schema';

export default function ContainerRegister() {
  const router = useRouter();
  const register = useApi().auth.mutate.register();
  const { values, errors, onChange, validate } = useAuthForm<typeof registerSchema>(
    registerSchema,
    { fullName: '', email: '', password: '' } as RegisterFormData
  );

  const handleSubmit = () => {
    const data = validate();
    if (!data) return;

    register.mutate(data, {
      onSuccess: (res) => {
        if (!res.data?.email) return;
        router.push(`/verify-otp?purpose=register&email=${encodeURIComponent(res.data.email)}`);
      },
    });
  };

  return (
    <RegisterPage
      values={values}
      errors={errors}
      loading={register.isPending}
      onChange={onChange}
      onSubmit={handleSubmit}
    />
  );
}
