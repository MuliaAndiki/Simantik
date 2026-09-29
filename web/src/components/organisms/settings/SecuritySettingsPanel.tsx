import type React from 'react';
import { Button, Input } from '@/components/atoms';

export interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecuritySettingsPanelProps {
  title?: string;
  description?: string;
  form: PasswordFormState;
  error?: string | null;
  isSubmitting?: boolean;
  onFieldChange: <K extends keyof PasswordFormState>(field: K, value: PasswordFormState[K]) => void;
  onSubmitPassword: () => void;
}

/** Panel keamanan: ganti kata sandi (validasi di container via password.util). */
export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = ({
  title = 'Autentikasi & Keamanan',
  description = 'Perbarui kata sandi akun dan amankan sesi Anda.',
  form,
  error,
  isSubmitting = false,
  onFieldChange,
  onSubmitPassword,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitPassword();
        }}
        className="space-y-4 max-w-xl"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Kata Sandi Lama</label>
          <Input
            type="password"
            value={form.currentPassword}
            onChange={(e) => onFieldChange('currentPassword', e.target.value)}
            placeholder="••••••••"
            className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
          <Input
            type="password"
            value={form.newPassword}
            onChange={(e) => onFieldChange('newPassword', e.target.value)}
            placeholder="Minimal 8 karakter"
            className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</label>
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
            placeholder="Ulangi kata sandi baru"
            className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs"
          />
        </div>

        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-10 px-5 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 border-0 shadow-2xs cursor-pointer transition-transform active:scale-98 disabled:opacity-60"
        >
          {isSubmitting ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
        </Button>
      </form>
    </div>
  );
};

export default SecuritySettingsPanel;
