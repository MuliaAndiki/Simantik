'use client';

import { Check, Clock, Eye, EyeOff, Lock, ShieldCheck, X } from 'lucide-react';
import type * as React from 'react';
import { useId, useMemo, useState } from 'react';
import { Input } from '@/components/atoms';
import {
  AmberDialogActions,
  DialogField,
  ManagerFormDialogShell,
} from '@/components/molecules/dialog';
import { cn } from '@/utils/classname';

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ChangePasswordForm;
  onChange: (field: keyof ChangePasswordForm, value: string) => void;
  error?: string | null;
  onSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  form,
  onChange,
  error = null,
  onSubmit,
  isSubmitting = false,
}: ChangePasswordModalProps) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { currentPassword, newPassword, confirmPassword } = form;

  // Criteria calculations
  const hasMinLength = newPassword.length >= 8;
  const hasLetterAndNumber = /[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(newPassword);

  const { strengthLabel, strengthLevel } = useMemo(() => {
    if (!newPassword) return { strengthLabel: 'Lemah', strengthLevel: 0 };
    let score = 0;
    if (hasMinLength) score++;
    if (hasLetterAndNumber) score++;
    if (hasSpecialChar || newPassword.length >= 10) score++;

    if (score <= 1) return { strengthLabel: 'Lemah', strengthLevel: 1 };
    if (score === 2) return { strengthLabel: 'Sedang', strengthLevel: 2 };
    return { strengthLabel: 'Kuat', strengthLevel: 3 };
  }, [newPassword, hasMinLength, hasLetterAndNumber, hasSpecialChar]);

  const passwordsMatch = newPassword !== '' && newPassword === confirmPassword;

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <ManagerFormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      icon={<Lock className="size-5 text-teal-600 stroke-[2.2]" />}
      iconBoxClassName="bg-[#EAF6F6] text-teal-600 border-teal-100/60"
      title="Ubah Password"
      description="Perbarui kata sandi akun kamu untuk menjaga keamanan data profil dan akses tryout terpadu SIMANTIK."
      error={error}
      onSubmit={onSubmit}
      footer={
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="size-3.5 text-teal-600 shrink-0" />
          <span>Enkripsi 256-bit SIMANTIK Data Security Standard</span>
        </div>
      }
    >
      {/* Field 1: Password Saat Ini */}
      <DialogField label="Password Saat Ini" htmlFor={currentPasswordId}>
        <div className="relative">
          <Input
            id={currentPasswordId}
            type={showCurrent ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={(e) => onChange('currentPassword', e.target.value)}
            placeholder="Masukkan password saat ini"
            className="pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-teal-500/30"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label={showCurrent ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showCurrent ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
        <div className="text-right">
          <button
            type="button"
            className="text-xs text-teal-600 hover:underline font-medium cursor-pointer"
            onClick={() => {
              /* Optional forgot password redirect */
            }}
          >
            Lupa password saat ini?
          </button>
        </div>
      </DialogField>

      {/* Field 2: Password Baru */}
      <DialogField label="Password Baru" htmlFor={newPasswordId}>
        <div className="relative">
          <Input
            id={newPasswordId}
            type={showNew ? 'text' : 'password'}
            value={form.newPassword}
            onChange={(e) => onChange('newPassword', e.target.value)}
            placeholder="Masukkan password baru"
            className="pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-teal-500/30"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label={showNew ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showNew ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </DialogField>

      {/* Password Strength Indicator Box */}
      <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-2xl p-4 space-y-3 text-left">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Kekuatan Password:</span>
          <span
            className={cn(
              'font-bold',
              strengthLevel === 3
                ? 'text-[#0F766E]'
                : strengthLevel === 2
                  ? 'text-amber-700'
                  : 'text-rose-600'
            )}
          >
            {strengthLabel}
          </span>
        </div>

        {/* 3 Progress Bars */}
        <div className="grid grid-cols-3 gap-2">
          <div
            className={cn(
              'h-1.5 rounded-full transition-colors duration-300',
              strengthLevel >= 1 ? 'bg-[#0F766E]' : 'bg-gray-200'
            )}
          />
          <div
            className={cn(
              'h-1.5 rounded-full transition-colors duration-300',
              strengthLevel >= 2 ? 'bg-[#0F766E]' : 'bg-gray-200'
            )}
          />
          <div
            className={cn(
              'h-1.5 rounded-full transition-colors duration-300',
              strengthLevel >= 3 ? 'bg-[#0F766E]' : 'bg-gray-200'
            )}
          />
        </div>

        {/* Checklist items */}
        <div className="space-y-1.5 pt-1 text-xs">
          <div
            className={cn(
              'flex items-center gap-2 transition-colors',
              hasMinLength ? 'text-[#0F766E] font-medium' : 'text-gray-400'
            )}
          >
            <Check
              className={cn(
                'size-3.5 stroke-[2.5]',
                hasMinLength ? 'text-[#0F766E]' : 'text-gray-300'
              )}
            />
            <span>Minimal 8 karakter</span>
          </div>

          <div
            className={cn(
              'flex items-center gap-2 transition-colors',
              hasLetterAndNumber ? 'text-[#0F766E] font-medium' : 'text-gray-400'
            )}
          >
            <Check
              className={cn(
                'size-3.5 stroke-[2.5]',
                hasLetterAndNumber ? 'text-[#0F766E]' : 'text-gray-300'
              )}
            />
            <span>Mengandung kombinasi huruf & angka</span>
          </div>
        </div>
      </div>

      {/* Field 3: Konfirmasi Password Baru */}
      <DialogField label="Konfirmasi Password Baru" htmlFor={confirmPasswordId}>
        <div className="relative">
          <Input
            id={confirmPasswordId}
            type={showConfirm ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            placeholder="Konfirmasi password baru"
            className="pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-teal-500/30"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label={showConfirm ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showConfirm ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1.5 pt-0.5">
          <Clock className="size-3.5 text-teal-600 shrink-0" />
          <span>Pastikan password konfirmasi sama persis dengan password baru.</span>
        </p>
      </DialogField>

      <AmberDialogActions
        onCancel={handleClose}
        submitDisabled={!currentPassword || !hasMinLength || !hasLetterAndNumber || !passwordsMatch}
        isSubmitting={isSubmitting}
        submitLabel="Simpan Password"
      />
    </ManagerFormDialogShell>
  );
}

export default ChangePasswordModal;
