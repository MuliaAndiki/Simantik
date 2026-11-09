'use client';

import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import type * as React from 'react';
import { Spinner } from '@/components/atoms/loading/Spinner';
import { AuthInput } from '@/components/molecules/auth/AuthInput';
import { AuthSecurityNotice } from '@/components/molecules/auth/AuthSecurityNotice';
import { FormField } from '@/components/molecules/auth/FormField';
import type { ForgotPasswordFormData } from '@/schemas/auth/auth.schema';

export interface ForgotPasswordFormProps {
  values: ForgotPasswordFormData;
  errors?: Partial<Record<keyof ForgotPasswordFormData, string>>;
  loading?: boolean;
  onChange: (field: keyof ForgotPasswordFormData, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onNavigateToLogin?: () => void;
}

export function ForgotPasswordForm({
  values,
  errors,
  loading = false,
  onChange,
  onSubmit,
  onNavigateToLogin,
}: ForgotPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Email / Username Input */}
      <FormField id="email" label="Email" error={errors?.email} required>
        <AuthInput
          id="email"
          type="email"
          icon={User}
          autoComplete="email"
          placeholder="masukkan email/username"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          disabled={loading}
          error={!!errors?.email}
        />
      </FormField>

      {/* Primary Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 mt-1 rounded-xl bg-[#F5C242] hover:bg-[#E8B534] active:bg-[#DBA726] text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading && <Spinner size="sm" className="text-slate-900" />}
        <span>{loading ? 'Mengirim link...' : 'Kirim Link Reset'}</span>
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Security Guarantee Notice */}
      <div className="pt-1">
        <AuthSecurityNotice variant="forgot-password" />
      </div>

      {/* Return to Login Link */}
      <div className="pt-2 text-center">
        <Link
          href="/login"
          onClick={(e) => {
            if (onNavigateToLogin) {
              e.preventDefault();
              onNavigateToLogin();
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Login</span>
        </Link>
      </div>
    </form>
  );
}
