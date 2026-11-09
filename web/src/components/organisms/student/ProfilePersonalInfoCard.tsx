import { Check, GraduationCap, Info, Lock, Mail, RotateCcw, User } from 'lucide-react';
import type * as React from 'react';
import { Button, Card, Input } from '@/components/atoms';
import { cn } from '@/utils/classname';

export interface ProfileSchoolOption {
  id: string;
  name: string;
}

export interface ProfilePersonalInfoCardProps {
  fullName: string;
  onFullNameChange: (val: string) => void;
  email: string;
  schoolName: string;
  onSchoolNameChange?: (val: string) => void;
  schoolOptions?: ProfileSchoolOption[];
  selectedSchoolId?: string;
  onSelectSchoolId?: (schoolId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
  versionCode?: string;
  className?: string;
}

export function ProfilePersonalInfoCard({
  fullName,
  onFullNameChange,
  email,
  schoolName,
  onSchoolNameChange,
  schoolOptions,
  selectedSchoolId,
  onSelectSchoolId,
  onSubmit,
  onReset,
  isSubmitting = false,
  isDirty = false,
  versionCode = '2025.1-SIM',
  className,
}: ProfilePersonalInfoCardProps) {
  return (
    <Card
      className={cn(
        'p-6 sm:p-8 rounded-2xl md:rounded-3xl border border-gray-200/80 bg-white shadow-xs space-y-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-2 border-b border-gray-100">
        <div className="size-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100/60">
          <User className="size-5 text-teal-600 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            Informasi Pribadi
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
            Perbarui data profil siswa yang terdaftar di SIMANTIK.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-full-name"
            className="block text-xs sm:text-sm font-semibold text-gray-700"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <Input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-teal-500/30 text-gray-900"
              required
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <User className="size-4.5" />
            </div>
          </div>
        </div>

        {/* Email Field (Official Account Email) */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-email"
            className="block text-xs sm:text-sm font-semibold text-gray-700"
          >
            Email
          </label>
          <div className="relative">
            <Input
              id="profile-email"
              type="email"
              value={email}
              readOnly
              aria-readonly="true"
              className="pr-10 h-11 rounded-xl border-gray-200 bg-gray-50/60 text-sm text-gray-800 cursor-not-allowed select-text"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <Mail className="size-4.5" />
            </div>
          </div>
        </div>

        {/* School Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="profile-school"
            className="block text-xs sm:text-sm font-semibold text-gray-700"
          >
            Sekolah
          </label>
          <div className="relative">
            {schoolOptions && schoolOptions.length > 0 && onSelectSchoolId ? (
              <select
                id="profile-school"
                value={
                  selectedSchoolId ||
                  schoolOptions.find(
                    (s) => s.name.toLowerCase() === (schoolName ?? '').toLowerCase()
                  )?.id ||
                  ''
                }
                onChange={(e) => onSelectSchoolId(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Pilih asal sekolah
                </option>
                {schoolOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id="profile-school"
                type="text"
                value={schoolName}
                onChange={(e) => onSchoolNameChange?.(e.target.value)}
                placeholder="Nama sekolah asal"
                className="pr-10 h-11 rounded-xl border-gray-200 bg-white text-sm focus-visible:ring-teal-500/30 text-gray-900"
              />
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              <GraduationCap className="size-4.5" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            isLoading={isSubmitting}
            className="h-11 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold text-sm px-6 gap-2 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
          >
            {!isSubmitting && <Check className="size-4 stroke-[2.5]" />}
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            disabled={isSubmitting || !isDirty}
            className="h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 cursor-pointer transition-colors disabled:opacity-40"
          >
            <RotateCcw className="size-3.5 sm:hidden" />
            <span>Batal</span>
          </Button>
        </div>
      </form>

      {/* Card Footer Security & Version Metadata */}
      <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Lock className="size-3.5 text-gray-400 stroke-[2.2]" />
          <span>Data akun dilindungi enkripsi privasi siswa.</span>
        </div>
        <div className="font-mono text-[11px] text-gray-400 font-medium tracking-wider">
          VER: {versionCode}
        </div>
      </div>
    </Card>
  );
}

export default ProfilePersonalInfoCard;
