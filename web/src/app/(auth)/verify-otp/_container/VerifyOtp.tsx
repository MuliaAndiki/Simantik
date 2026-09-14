'use client';

import { useSearchParams } from 'next/navigation';
import { VerifyOtpPage } from '@/components/page/auth/VerifyOtpPage';
import { useApi } from '@/hooks/useApi';
import { useAuthForm } from '@/hooks/useAuthForm';
import { type VerifyOtpFormData, verifyOtpSchema } from '@/schemas/auth/auth.schema';
import { setSessionCookies } from '@/utils/session-cookie';

// ponytail: redirect pasca-verifikasi register diputuskan di hooks auth
// (routeAfterAuth); container hanya menyimpan sesi cookie.
export default function ContainerVerifyOtp() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const isRegisterFlow = searchParams.get('purpose') === 'register';

  const { mutate } = useApi().auth;
  const verifyRegisterOtp = mutate.verifyRegisterOtp();
  const verifyOtp = mutate.verifyOtp();
  const resendOtp = mutate.resendOtp();

  const { values, errors, onChange, validate } = useAuthForm<typeof verifyOtpSchema>(
    verifyOtpSchema,
    { email, otp: '' } as VerifyOtpFormData
  );

  const handleSubmit = () => {
    const data = validate();
    if (!data) return;

    if (isRegisterFlow) {
      verifyRegisterOtp.mutate(data, {
        onSuccess: (res) => {
          if (!res.data) return;
          setSessionCookies({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken ?? undefined,
            role: res.data.user.role,
          });
        },
      });
      return;
    }

    verifyOtp.mutate(data, {
      onSuccess: (res) => {
        if (!res.data?.resetToken) return;
        window.location.assign(`/reset-password?token=${encodeURIComponent(res.data.resetToken)}`);
      },
    });
  };

  return (
    <VerifyOtpPage
      values={values}
      errors={errors}
      loading={verifyRegisterOtp.isPending || verifyOtp.isPending}
      onChange={onChange}
      onSubmit={handleSubmit}
      onResendOtp={email ? () => resendOtp.mutate({ email }) : undefined}
      resendLoading={resendOtp.isPending}
    />
  );
}
