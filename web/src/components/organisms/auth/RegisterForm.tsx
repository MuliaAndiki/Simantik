import type * as React from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { FormField } from '@/components/molecules/auth/FormField';
import { PasswordField } from '@/components/molecules/auth/PasswordField';
import type { RegisterFormData } from '@/schemas/auth/auth.schema';

export interface RegisterFormProps {
  values: RegisterFormData;
  errors?: Partial<Record<keyof RegisterFormData, string>>;
  loading?: boolean;
  onChange: (field: keyof RegisterFormData, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export function RegisterForm({
  values,
  errors,
  loading = false,
  onChange,
  onSubmit,
}: RegisterFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <FormField id="fullName" label="Nama Lengkap" error={errors?.fullName} required>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="masukkan nama lengkap"
          value={values.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField id="email" label="Email" error={errors?.email} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="masukkan email atau username"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          disabled={loading}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors?.password} required>
        <PasswordField
          id="password"
          placeholder="minimal 8 karakter"
          value={values.password}
          onChange={(e) => onChange('password', e.target.value)}
          disabled={loading}
        />
      </FormField>

      <Button type="submit" className="w-full h-12 rounded-sm mt-2" isLoading={loading}>
        {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
      </Button>
    </form>
  );
}
