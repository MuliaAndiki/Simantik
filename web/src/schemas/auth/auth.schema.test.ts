import { describe, expect, it } from 'bun:test';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from './auth.schema';

describe('Auth Validation Schemas', () => {
  it('validates login schema correctly', () => {
    expect(loginSchema.safeParse({ email: 'invalid', password: '123' }).success).toBe(false);
    expect(
      loginSchema.safeParse({ email: 'test@example.com', password: 'secretpassword' }).success
    ).toBe(true);
  });

  it('validates register schema with minimum requirements', () => {
    expect(
      registerSchema.safeParse({ fullName: 'A', email: 'test@example.com', password: 'short' })
        .success
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }).success
    ).toBe(true);
  });

  it('validates OTP schema length 6', () => {
    expect(verifyOtpSchema.safeParse({ email: 'test@example.com', otp: '123' }).success).toBe(
      false
    );
    expect(verifyOtpSchema.safeParse({ email: 'test@example.com', otp: '123456' }).success).toBe(
      true
    );
  });

  it('validates reset password confirmation match', () => {
    expect(
      resetPasswordSchema.safeParse({
        resetToken: 'token123',
        newPassword: 'password123',
        confirmPassword: 'mismatchpassword',
      }).success
    ).toBe(false);

    expect(
      resetPasswordSchema.safeParse({
        resetToken: 'token123',
        newPassword: 'password123',
        confirmPassword: 'password123',
      }).success
    ).toBe(true);
  });
});
