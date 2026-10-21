'use client';

import { ArrowRight } from 'lucide-react';
import type * as React from 'react';
import { Spinner } from '@/components/atoms/loading/Spinner';
import { AuthSecurityNotice } from '@/components/molecules/auth/AuthSecurityNotice';
import { FormField } from '@/components/molecules/auth/FormField';
import { PasswordField } from '@/components/molecules/auth/PasswordField';
import type { ResetPasswordFormData } from '@/schemas/auth/auth.schema';

export interface ResetPasswordFormProps {
  values: ResetPasswordFormData;
  errors?: Partial<Record<keyof ResetPasswordFormData, string>>;
  loading?: boolean;
  onChange: (field: keyof ResetPasswordFormData, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export function ResetPasswordForm({
  values,
  errors,
  loading = false,
  onChange,
  onSubmit,
}: ResetPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <FormField id="newPassword" label="Password Baru" error={errors?.newPassword} required>
        <PasswordField
          id="newPassword"
          placeholder="minimal 8 karakter"
          value={values.newPassword}
          onChange={(e) => onChange('newPassword', e.target.value)}
          disabled={loading}
          error={!!errors?.newPassword}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Konfirmasi Password"
        error={errors?.confirmPassword}
        required
      >
        <PasswordField
          id="confirmPassword"
          placeholder="ulangi password baru"
          value={values.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          disabled={loading}
          error={!!errors?.confirmPassword}
        />
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 mt-1 rounded-xl bg-[#F5C242] hover:bg-[#E8B534] active:bg-[#DBA726] text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading && <Spinner size="sm" className="text-slate-900" />}
        <span>{loading ? 'Menyimpan...' : 'Perbarui Password'}</span>
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>

      <div className="pt-1">
        <AuthSecurityNotice variant="forgot-password" />
      </div>
    </form>
  );
}
