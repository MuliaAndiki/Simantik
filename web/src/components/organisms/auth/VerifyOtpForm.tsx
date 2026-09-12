'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { AuthSecurityNotice } from '@/components/molecules/auth/AuthSecurityNotice';
import { FormField } from '@/components/molecules/auth/FormField';
import { OtpInput } from '@/components/molecules/auth/OtpInput';
import type { VerifyOtpFormData } from '@/schemas/auth/auth.schema';

export interface VerifyOtpFormProps {
  values: VerifyOtpFormData;
  errors?: Partial<Record<keyof VerifyOtpFormData, string>>;
  loading?: boolean;
  onChange: (field: keyof VerifyOtpFormData, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onResendOtp?: () => void;
  resendLoading?: boolean;
  changeEmailHref?: string;
}

export function VerifyOtpForm({
  values,
  errors,
  loading = false,
  onChange,
  onSubmit,
  onResendOtp,
  resendLoading = false,
  changeEmailHref = '/register',
}: VerifyOtpFormProps) {
  // Countdown timer for OTP resend (starts at 50s)
  const [secondsLeft, setSecondsLeft] = React.useState(47);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    if (secondsLeft > 0 || resendLoading || loading) return;
    onResendOtp?.();
    setSecondsLeft(60);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const formattedTimer = `00:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* Subtitle instructions */}
      <p className="text-xs sm:text-sm text-slate-500 text-center">
        Masukkan 6 digit kode yang kami kirim untuk melanjutkan.
      </p>

      {/* 6 Digit OTP input */}
      <FormField id="otp" label="" error={errors?.otp}>
        <OtpInput
          id="otp"
          value={values.otp}
          length={6}
          disabled={loading}
          error={!!errors?.otp}
          onChange={(e) => onChange('otp', e.target.value)}
        />
      </FormField>

      {/* Primary Submit Button */}
      <button
        type="submit"
        disabled={loading || values.otp.length < 6}
        className="w-full h-12 rounded-xl bg-[#F5C242] hover:bg-[#E8B534] active:bg-[#DBA726] text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span>{loading ? 'Memverifikasi...' : 'Verifikasi'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Resend OTP info / timer */}
      <div className="text-center text-xs sm:text-sm text-slate-500">
        {secondsLeft > 0 ? (
          <p>
            Belum menerima kode?{' '}
            <span className="font-semibold text-slate-700">
              Kirim ulang dalam{' '}
              <span className="font-mono text-teal-600 font-bold">{formattedTimer}</span>
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || loading}
            className="font-bold text-teal-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
          >
            {resendLoading ? 'Mengirim ulang...' : 'Kirim ulang kode OTP sekarang'}
          </button>
        )}
      </div>

      {/* Ubah alamat email */}
      <div className="text-center">
        <Link
          href={changeEmailHref}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ubah alamat email</span>
        </Link>
      </div>

      {/* Student Security Guarantee Notice */}
      <div className="pt-2">
        <AuthSecurityNotice variant="otp" />
      </div>
    </form>
  );
}
