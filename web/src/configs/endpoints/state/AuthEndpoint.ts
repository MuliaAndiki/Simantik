import { mountEntry } from '@/utils/mount.entry';

export const AuthEndpoint = {
  register: `${mountEntry.auth}/register`,
  login: `${mountEntry.auth}/login`,
  refreshToken: `${mountEntry.auth}/refresh`,
  logout: `${mountEntry.auth}/logout`,
  forgotPassword: `${mountEntry.auth}/forgotPassword`,
  verifyOtp: `${mountEntry.auth}/verifyOtp`,
  resetPassword: `${mountEntry.auth}/resetPassword`,
  google: `${mountEntry.auth}/loginGoogle`,
  resendOtp: `${mountEntry.auth}/resendRegisterOtp`,
} as const;
