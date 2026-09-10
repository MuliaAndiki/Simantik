import { ApiResponse } from '@/server/type';
import type { UserResponse } from './UserServiceType';

// ============================================================================
// Auth Service Request Payloads
// ============================================================================

/**
 * Payload for self-service user registration
 * Maps to backend: `dto.RegisterRequest`
 */
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Payload for email/password authentication
 * Maps to backend: `dto.LoginRequest`
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Carries refresh token for session renewal
 * Maps to backend: `dto.RefreshRequest`
 */
export interface RefreshRequest {
  refreshToken: string;
}

/**
 * Carries refresh token to revoke
 * Maps to backend: `dto.LogoutRequest`
 */
export interface LogoutRequest {
  refreshToken: string;
}

/**
 * Initiates OTP-based password recovery flow
 * Maps to backend: `dto.ForgotPasswordRequest`
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Validates OTP sent to user email for password reset
 * Maps to backend: `dto.VerifyOTPRequest`
 */
export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

/**
 * Sets new password using reset token obtained from VerifyOTP
 * Maps to backend: `dto.ResetPasswordRequest`
 */
export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

/**
 * Carries Google ID token for server-side verification
 * Maps to backend: `dto.GoogleLoginRequest`
 */
export interface GoogleLoginRequest {
  idToken: string;
}

/**
 * Requests fresh OTP for registration or verification
 * Maps to backend: `dto.ResendOTPRequest`
 */
export interface ResendOTPRequest {
  email: string;
}

/**
 * Validates registration OTP and activates account
 * Maps to backend: `dto.VerifyRegisterOTPRequest`
 */
export interface VerifyRegisterOTPRequest {
  email: string;
  otp: string;
}

// ============================================================================
// Auth Service Response Payloads
// ============================================================================

/**
 * Returned when registration is initiated and OTP is dispatched
 * Maps to backend: `dto.RegisterResponse`
 */
export interface RegisterResponse {
  email: string;
  message: string;
}

/**
 * Returned on successful login, register verification, refresh, or Google login.
 * (Refresh token is delivered via httpOnly cookie)
 * Maps to backend: `dto.AuthResponse`
 */
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
}

/**
 * Returned after successful password reset OTP verification
 * Maps to backend: `dto.VerifyOTPResponse`
 */
export interface VerifyOTPResponse {
  resetToken: string;
  message: string;
}

// ============================================================================
// Standard Wrapped Responses
// ============================================================================

export type RegisterApiResponse = ApiResponse<RegisterResponse>;
export type AuthApiResponse = ApiResponse<AuthResponse>;
export type VerifyOTPApiResponse = ApiResponse<VerifyOTPResponse>;
