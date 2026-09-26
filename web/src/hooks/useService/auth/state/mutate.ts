import { getRoleDashboardPath } from '@/configs/app.config';
import { queryKey } from '@/configs/query-key';
import { useAppMutation } from '@/hooks/_shared/useAppMutation';
import Api from '@/services/props.service';
import type {
  AuthResponse,
  ForgotPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOTPRequest,
  ResetPasswordRequest,
  VerifyOTPRequest,
  VerifyOTPResponse,
  VerifyRegisterOTPRequest,
} from '@/types/service';
import { type AuthCacheContext, readAuthSnapshot } from '@/utils/cache/auth.cache';
import { setSessionCookies } from '@/utils/session-cookie';

const STUDENT_ROLE = 'student';
const SCHOOL_ONBOARDING_PATH = '/pilih-sekolah';

/**
 * Routing pasca-login: pelajar yang belum punya sekolah diarahkan ke halaman
 * pemilihan sekolah; selain itu semua role diarahkan ke dashboard role-nya
 * (student → /home, admin/content_manager → /admin/dashboard).
 */
function routeAfterAuth(user: { role: string; hasSchool: boolean } | null | undefined) {
  if (!user) return;
  if (user.role === STUDENT_ROLE && !user.hasSchool) {
    window.location.assign(SCHOOL_ONBOARDING_PATH);
    return;
  }
  window.location.assign('/dashboard');
}

export function useLogin() {
  return useAppMutation<AuthResponse, LoginRequest, AuthCacheContext>({
    mutationFn: (body: LoginRequest) => Api.auth.LoginService(body),
    invalidateKeys: [queryKey.authRoot(), queryKey.userRoot()],
    optimistic: (ns) => ({ previousData: readAuthSnapshot(ns) }),
    onSuccess: (res) => {
      if (res.data) {
        setSessionCookies({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken ?? undefined,
          role: res.data.user.role,
        });
      }
      routeAfterAuth(res.data?.user);
    },
  });
}

export function useRegister() {
  return useAppMutation<RegisterResponse, RegisterRequest, AuthCacheContext>({
    mutationFn: (body: RegisterRequest) => Api.auth.RegisterService(body),
    invalidateKeys: [queryKey.authRoot()],
  });
}

export function useVerifyRegisterOTP() {
  return useAppMutation<AuthResponse, VerifyRegisterOTPRequest, AuthCacheContext>({
    mutationFn: (body: VerifyRegisterOTPRequest) => Api.auth.VerifyRegisterOTPService(body),
    invalidateKeys: [queryKey.authRoot(), queryKey.userRoot()],
    onSuccess: (res) => {
      if (res.data) {
        setSessionCookies({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken ?? undefined,
          role: res.data.user.role,
        });
      }
      routeAfterAuth(res.data?.user);
    },
  });
}

export function useResendOTP() {
  return useAppMutation<null, ResendOTPRequest, AuthCacheContext>({
    mutationFn: (body: ResendOTPRequest) => Api.auth.ResendOTPService(body),
  });
}

export function useRefreshToken() {
  return useAppMutation<AuthResponse, RefreshRequest | undefined, AuthCacheContext>({
    mutationFn: (body?: RefreshRequest) => Api.auth.RefreshTokenService(body),
    invalidateKeys: [queryKey.authRoot()],
    showSuccessToast: false,
    onSuccess: (res) => {
      if (res.data) {
        setSessionCookies({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken ?? undefined,
          role: res.data.user.role,
        });
      }
    },
  });
}

export function useLogout() {
  return useAppMutation<null, LogoutRequest | undefined, AuthCacheContext>({
    mutationFn: (body?: LogoutRequest) => Api.auth.LogoutService(body),
    onSettled: (_data, _error, _variables, _context, ns) => {
      ns.queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useAppMutation<null, ForgotPasswordRequest, AuthCacheContext>({
    mutationFn: (body: ForgotPasswordRequest) => Api.auth.ForgotPasswordService(body),
  });
}

export function useVerifyOTP() {
  return useAppMutation<VerifyOTPResponse, VerifyOTPRequest, AuthCacheContext>({
    mutationFn: (body: VerifyOTPRequest) => Api.auth.VerifyOTPService(body),
  });
}

export function useResetPassword() {
  return useAppMutation<null, ResetPasswordRequest, AuthCacheContext>({
    mutationFn: (body: ResetPasswordRequest) => Api.auth.ResetPasswordService(body),
    invalidateKeys: [queryKey.authRoot()],
  });
}

export function useGoogleLogin() {
  return useAppMutation<AuthResponse, GoogleLoginRequest, AuthCacheContext>({
    mutationFn: (body: GoogleLoginRequest) => Api.auth.GoogleLoginService(body),
    invalidateKeys: [queryKey.authRoot(), queryKey.userRoot()],
    onSuccess: (res) => {
      if (res.data) {
        setSessionCookies({
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken ?? undefined,
          role: res.data.user.role,
        });
      }
      routeAfterAuth(res.data?.user);
    },
  });
}
