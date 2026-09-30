import type React from 'react';
import { Button, Input } from '@/components/atoms';

export interface ProfileSettingsPanelProps {
  title: string;
  description: string;
  fullName: string;
  email: string;
  emailNote?: string;
  extraRows?: React.ReactNode;
  isSaving?: boolean;
  onFullNameChange: (name: string) => void;
  onSaveProfile: (e: React.FormEvent) => void;
}

/** Panel profil: nama bisa diubah, email read-only. */
export const ProfileSettingsPanel: React.FC<ProfileSettingsPanelProps> = ({
  title,
  description,
  fullName,
  email,
  emailNote,
  extraRows,
  isSaving = false,
  onFullNameChange,
  onSaveProfile,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
      </div>

      <form onSubmit={onSaveProfile} className="space-y-4 max-w-xl">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
          <Input
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Nama Lengkap"
            className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Alamat Email</label>
          <Input
            value={email}
            disabled
            className="h-10 rounded-xl bg-slate-100 border-slate-200 text-xs font-medium text-slate-500 cursor-not-allowed"
          />
          {emailNote && <span className="text-[11px] text-slate-400">{emailNote}</span>}
        </div>

        {extraRows}

        <Button
          type="submit"
          disabled={isSaving}
          className="mt-2 h-10 px-5 rounded-xl font-bold text-xs bg-[#F5B731] hover:bg-[#E5A721] text-slate-900 border-0 shadow-2xs cursor-pointer transition-transform active:scale-98 disabled:opacity-60"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileSettingsPanel;
