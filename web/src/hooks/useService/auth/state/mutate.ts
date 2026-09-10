import { useMutation } from '@tanstack/react-query';
import type { TResponse } from '@/api/types/response.types';
import { queryKey } from '@/configs/query-key';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
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
import { ResponseTitles } from '@/utils/response-titles';

export function useLogin() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<AuthResponse>, Error, LoginRequest, AuthCacheContext>({
    mutationFn: (body: LoginRequest) => Api.auth.LoginService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.authRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
    },
    onMutate: async () => {
      await ns.queryClient.cancelQueries({
        queryKey: queryKey.authRoot(),
      });
      const previousData = readAuthSnapshot(ns);
      return { previousData };
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useRegister() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<RegisterResponse>, Error, RegisterRequest, AuthCacheContext>({
    mutationFn: (body: RegisterRequest) => Api.auth.RegisterService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.authRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useVerifyRegisterOTP() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<AuthResponse>, Error, VerifyRegisterOTPRequest, AuthCacheContext>({
    mutationFn: (body: VerifyRegisterOTPRequest) => Api.auth.VerifyRegisterOTPService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.authRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useResendOTP() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, ResendOTPRequest, AuthCacheContext>({
    mutationFn: (body: ResendOTPRequest) => Api.auth.ResendOTPService(body),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useRefreshToken() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<AuthResponse>, Error, RefreshRequest | undefined, AuthCacheContext>({
    mutationFn: (body?: RefreshRequest) => Api.auth.RefreshTokenService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.authRoot(),
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useLogout() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, LogoutRequest | undefined, AuthCacheContext>({
    mutationFn: (body?: LogoutRequest) => Api.auth.LogoutService(body),
    onSettled: async () => {
      ns.queryClient.clear();
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useForgotPassword() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, ForgotPasswordRequest, AuthCacheContext>({
    mutationFn: (body: ForgotPasswordRequest) => Api.auth.ForgotPasswordService(body),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useVerifyOTP() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<VerifyOTPResponse>, Error, VerifyOTPRequest, AuthCacheContext>({
    mutationFn: (body: VerifyOTPRequest) => Api.auth.VerifyOTPService(body),
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useResetPassword() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<null>, Error, ResetPasswordRequest, AuthCacheContext>({
    mutationFn: (body: ResetPasswordRequest) => Api.auth.ResetPasswordService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.authRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}

export function useGoogleLogin() {
  const ns = useAppNameSpace();
  return useMutation<TResponse<AuthResponse>, Error, GoogleLoginRequest, AuthCacheContext>({
    mutationFn: (body: GoogleLoginRequest) => Api.auth.GoogleLoginService(body),
    onSettled: async () => {
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.authRoot(),
      });
      await ns.queryClient.invalidateQueries({
        queryKey: queryKey.userRoot(),
      });
    },
    onSuccess: (res) => {
      ns.alert.toast({
        title: res.title,
        message: res.message,
        icon: 'success',
      });
    },
    onError: (err) => {
      ns.alert.toast({
        title: ResponseTitles.error,
        message: err.message,
        icon: 'error',
      });
    },
  });
}
