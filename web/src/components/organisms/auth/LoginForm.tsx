"use client";

import { ArrowRight, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { AuthInput } from "@/components/molecules/auth/AuthInput";
import { AuthSecurityNotice } from "@/components/molecules/auth/AuthSecurityNotice";
import { FormField } from "@/components/molecules/auth/FormField";
import { PasswordField } from "@/components/molecules/auth/PasswordField";
import { SocialLoginButton } from "@/components/molecules/auth/SocialLoginButton";
import type { LoginFormData } from "@/schemas/auth/auth.schema";

export interface LoginFormProps {
  values: LoginFormData;
  errors?: Partial<Record<keyof LoginFormData, string>>;
  loading?: boolean;
  rememberMe: boolean;
  onRememberMeChange: (remember: boolean) => void;
  onChange: (field: keyof LoginFormData, value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onGoogleLogin?: () => void;
  onNavigateToForgotPassword?: () => void;
  onNavigateToRegister?: () => void;
  googleSlot?: React.ReactNode;
}

export function LoginForm({
  values,
  errors,
  loading = false,
  rememberMe,
  onRememberMeChange,
  onChange,
  onSubmit,
  onGoogleLogin,
  onNavigateToForgotPassword,
  onNavigateToRegister,
  googleSlot,
}: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Email / Username Input */}
      <FormField
        id="email"
        label="Email / Username"
        error={errors?.email}
        required
      >
        <AuthInput
          id="email"
          type="email"
          icon={User}
          autoComplete="email"
          placeholder="masukkan email/username"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          disabled={loading}
          error={!!errors?.email}
        />
      </FormField>

      {/* Password Input */}
      <FormField
        id="password"
        label="Password"
        error={errors?.password}
        required
      >
        <PasswordField
          id="password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => onChange("password", e.target.value)}
          disabled={loading}
          error={!!errors?.password}
        />
      </FormField>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between pt-0.5 text-xs sm:text-sm">
        <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            disabled={loading}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600 cursor-pointer"
          />
          <span>Ingat saya</span>
        </label>

        <Link
          href="/forgot-password"
          onClick={(e) => {
            if (onNavigateToForgotPassword) {
              e.preventDefault();
              onNavigateToForgotPassword();
            }
          }}
          className="font-medium text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          Lupa password?
        </Link>
      </div>

      {/* Primary Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 mt-1 rounded-xl bg-[#F5C242] hover:bg-[#E8B534] active:bg-[#DBA726] text-slate-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span>{loading ? "Memproses..." : "Masuk"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Register Link Text */}
      <p className="text-center text-xs text-slate-500 pt-1">
        Belum punya akun?{" "}
        <Link
          href="/register"
          onClick={(e) => {
            if (onNavigateToRegister) {
              e.preventDefault();
              onNavigateToRegister();
            }
          }}
          className="font-bold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          Daftar sekarang
        </Link>{" "}
        untuk akses latihan gratis.
      </p>

      {/* Divider */}
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-400">
            atau masuk dengan
          </span>
        </div>
      </div>

      {/* Google Login Slot / Fallback Button */}
      {googleSlot ? (
        <div className="flex justify-center w-full ">{googleSlot}</div>
      ) : (
        <SocialLoginButton
          provider="google"
          onClick={onGoogleLogin}
          disabled={loading}
        >
          Login dengan Google
        </SocialLoginButton>
      )}

      {/* Security Guarantee Notice */}
      <div className="pt-2">
        <AuthSecurityNotice variant="default" />
      </div>
    </form>
  );
}
